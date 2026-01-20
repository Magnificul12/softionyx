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

async function createUser() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('=== SoftIonyx User Creator ===\n');

  const askQuestion = (question) => {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  };

  try {
    const email = await askQuestion('Enter email (default: admin@softionyx.com): ') || 'admin@softionyx.com';
    const fullName = await askQuestion('Enter full name (default: Admin User): ') || 'Admin User';
    const password = await askQuestion('Enter password (default: admin123): ') || 'admin123';
    const role = await askQuestion('Enter role (admin/user, default: admin): ') || 'admin';
    const companyName = await askQuestion('Enter company name (optional, press Enter to skip): ') || null;
    const phone = await askQuestion('Enter phone (optional, press Enter to skip): ') || null;

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      console.log('\n❌ Error: User with this email already exists!');
      rl.close();
      await pool.end();
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, full_name, company_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, full_name, role`,
      [email.toLowerCase(), passwordHash, fullName, companyName, phone, role]
    );

    const user = result.rows[0];

    console.log('\n✅ User created successfully!');
    console.log('\n=== User Details ===');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Full Name: ${user.full_name}`);
    console.log(`Role: ${user.role}`);
    console.log(`\nYou can now login with:`);
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${password}`);

  } catch (error) {
    console.error('\n❌ Error creating user:', error.message);
    if (error.code === '23505') {
      console.error('Email already exists in database!');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to database. Please check your database configuration in .env file.');
    }
  } finally {
    rl.close();
    await pool.end();
  }
}

createUser();
