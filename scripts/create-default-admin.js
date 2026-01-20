const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'softionyx',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function createDefaultAdmin() {
  try {
    const email = 'admin@softionyx.com';
    const fullName = 'Admin User';
    const password = 'admin123';
    const role = 'admin';

    console.log('=== Creating Default Admin Account ===\n');

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️  User already exists!');
      console.log(`Email: ${existingUser.rows[0].email}`);
      console.log(`ID: ${existingUser.rows[0].id}`);
      console.log('\nTo create a different account, use: npm run create-user');
      await pool.end();
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, role`,
      [email.toLowerCase(), passwordHash, fullName, role]
    );

    const user = result.rows[0];

    console.log('✅ Admin account created successfully!\n');
    console.log('=== Login Credentials ===');
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${password}`);
    console.log(`Role: ${user.role}`);
    console.log(`\nYou can now login at: http://localhost:5173/login`);

  } catch (error) {
    console.error('\n❌ Error creating admin account:', error.message);
    if (error.code === '23505') {
      console.error('Email already exists in database!');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to database. Please check:');
      console.error('1. PostgreSQL is running');
      console.error('2. Database "softionyx" exists');
      console.error('3. .env file has correct database credentials');
    } else if (error.code === '3D000') {
      console.error('Database "softionyx" does not exist. Please create it first:');
      console.error('  createdb softionyx');
    } else if (error.code === '42P01') {
      console.error('Table "users" does not exist. Please run the schema:');
      console.error('  psql -d softionyx -f database/schema.sql');
    } else {
      console.error('Full error:', error);
    }
  } finally {
    await pool.end();
  }
}

createDefaultAdmin();
