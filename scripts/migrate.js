#!/usr/bin/env node
/**
 * Database migration runner
 * ─────────────────────────
 *
 * Runs every `*.sql` file under `database/migrations/` in alphabetical
 * order, skipping any that have already been applied.
 *
 * Tracking is done via a `_migrations` table that stores:
 *   - filename           (unique, primary key)
 *   - checksum           (sha256 of the file contents; if the file
 *                         changes after being applied we refuse to run
 *                         anything until the dev resolves it manually)
 *   - applied_at         (timestamp)
 *
 * Each migration runs inside a transaction, so a failure rolls back
 * cleanly and leaves the database in a consistent state.
 *
 * Usage:
 *   npm run db:migrate             → apply pending migrations
 *   npm run db:migrate -- --init   → also run `database/schema.sql`
 *                                    first (for fresh databases)
 *   npm run db:migrate -- --status → show which migrations are
 *                                    applied vs pending; exit 0
 *
 * Exit codes:
 *   0 = success (or nothing to do)
 *   1 = failure (connection, SQL error, or checksum mismatch)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Pool } = require('pg');

require('dotenv').config();

// ─── config ──────────────────────────────────────────────────────────────
const MIGRATIONS_DIR = path.join(__dirname, '..', 'database', 'migrations');
const SCHEMA_FILE    = path.join(__dirname, '..', 'database', 'schema.sql');

const args = process.argv.slice(2);
const wantInit   = args.includes('--init');
const wantStatus = args.includes('--status');

// ─── helpers ─────────────────────────────────────────────────────────────
const c = {
  dim:    (s) => `\x1b[2m${s}\x1b[0m`,
  bold:   (s) => `\x1b[1m${s}\x1b[0m`,
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
};

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename    VARCHAR(255) PRIMARY KEY,
      checksum    VARCHAR(64)  NOT NULL,
      applied_at  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getApplied(client) {
  const { rows } = await client.query(
    `SELECT filename, checksum, applied_at FROM _migrations ORDER BY filename ASC`
  );
  return new Map(rows.map((r) => [r.filename, r]));
}

async function runSqlFile(client, filePath, label) {
  const sql = fs.readFileSync(filePath, 'utf8');
  console.log(c.dim(`  → executing ${label} (${sql.length} bytes)`));
  await client.query(sql);
}

// ─── main ────────────────────────────────────────────────────────────────
async function main() {
  const pool = new Pool({
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'softionyx',
    user:     process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    // Fail fast in CI instead of hanging if the DB is down.
    connectionTimeoutMillis: 5000,
  });

  const client = await pool.connect();
  try {
    // ─── --status: report only, then exit ──────────────────────────
    if (wantStatus) {
      await ensureMigrationsTable(client);
      const applied = await getApplied(client);
      const files = listMigrationFiles();

      console.log(c.bold('\nMigration status'));
      console.log(c.dim('─'.repeat(60)));
      if (files.length === 0) {
        console.log(c.yellow('  (no migration files found)'));
      }
      for (const f of files) {
        const row = applied.get(f);
        if (!row) {
          console.log(`  ${c.yellow('○ pending ')} ${f}`);
        } else {
          const at = new Date(row.applied_at).toISOString().replace('T', ' ').slice(0, 19);
          console.log(`  ${c.green('● applied ')} ${f}  ${c.dim(at)}`);
        }
      }
      console.log(c.dim('─'.repeat(60)));
      return;
    }

    // ─── --init: run schema.sql first ──────────────────────────────
    if (wantInit) {
      if (!fs.existsSync(SCHEMA_FILE)) {
        console.error(c.red(`✗ --init requested but ${SCHEMA_FILE} not found`));
        process.exitCode = 1;
        return;
      }
      console.log(c.bold('→ Initialising base schema from schema.sql'));
      await runSqlFile(client, SCHEMA_FILE, 'schema.sql');
      console.log(c.green('  ✓ base schema applied'));
    }

    await ensureMigrationsTable(client);
    const applied = await getApplied(client);
    const files = listMigrationFiles();

    if (files.length === 0) {
      console.log(c.yellow('No migration files under database/migrations/'));
      return;
    }

    // ─── integrity check: applied file contents mustn't have changed ─
    for (const [filename, row] of applied) {
      const p = path.join(MIGRATIONS_DIR, filename);
      if (!fs.existsSync(p)) {
        console.warn(
          c.yellow(
            `  ! ${filename} is recorded as applied but the file no longer exists (ignored)`
          )
        );
        continue;
      }
      const current = sha256(fs.readFileSync(p, 'utf8'));
      if (current !== row.checksum) {
        console.error(
          c.red(`✗ Checksum mismatch for ${filename}`) +
            `\n   applied: ${row.checksum}\n   current: ${current}\n` +
            c.dim(
              '   The migration file was modified after being applied. ' +
                'Create a NEW migration instead of editing an old one.'
            )
        );
        process.exitCode = 1;
        return;
      }
    }

    const pending = files.filter((f) => !applied.has(f));
    if (pending.length === 0) {
      console.log(c.green('✓ Database is up to date') + c.dim(` (${files.length} applied)`));
      return;
    }

    console.log(c.bold(`→ Applying ${pending.length} migration(s)`));
    for (const filename of pending) {
      const filePath = path.join(MIGRATIONS_DIR, filename);
      const sql = fs.readFileSync(filePath, 'utf8');
      const checksum = sha256(sql);

      console.log(`  ${c.cyan('▶')} ${filename}`);
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query(
          `INSERT INTO _migrations (filename, checksum) VALUES ($1, $2)`,
          [filename, checksum]
        );
        await client.query('COMMIT');
        console.log(`  ${c.green('✓')} ${filename}`);
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        console.error(c.red(`  ✗ ${filename} failed — rolled back`));
        console.error(c.red('    ' + (err.message || err)));
        throw err;
      }
    }

    console.log(c.green(`\n✓ All migrations applied (${pending.length} new, ${files.length} total)`));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  // Pool.connect failures (DB down, wrong creds) land here.
  if (err && err.code === 'ECONNREFUSED') {
    console.error(c.red('✗ Cannot connect to PostgreSQL — is it running?'));
  } else if (err && err.code === '3D000') {
    console.error(c.red('✗ Database does not exist. Run `CREATE DATABASE softionyx;` first.'));
  } else {
    console.error(c.red('✗ Migration failed:'), err.message || err);
  }
  process.exit(1);
});
