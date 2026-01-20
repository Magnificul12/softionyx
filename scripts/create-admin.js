const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== SoftIonyx Admin User Creator ===\n');

rl.question('Enter admin email (default: admin@softionyx.com): ', (email) => {
  email = email || 'admin@softionyx.com';
  
  rl.question('Enter admin full name (default: Admin User): ', (fullName) => {
    fullName = fullName || 'Admin User';
    
    rl.question('Enter admin password (default: admin123): ', (password) => {
      password = password || 'admin123';
      
      const passwordHash = bcrypt.hashSync(password, 10);
      
      console.log('\n=== SQL Query ===\n');
      console.log(`INSERT INTO users (email, password_hash, full_name, role) 
VALUES (
  '${email}',
  '${passwordHash}',
  '${fullName}',
  'admin'
);`);
      
      console.log('\n=== Copy and run this SQL in your PostgreSQL database ===\n');
      
      rl.close();
    });
  });
});
