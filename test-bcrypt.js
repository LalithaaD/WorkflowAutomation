const bcrypt = require('bcryptjs');

async function testBcrypt() {
  const password = 'password123';
  const hash = '$2a$10$DBJgJmUUCf7Lno3.Er.aEO3AnNV6o/tNTBWgUa5CTVvz6SbGvC5Sq';
  
  console.log('Testing password:', password);
  console.log('Testing hash:', hash);
  
  const result = await bcrypt.compare(password, hash);
  console.log('Bcrypt comparison result:', result);
  
  // Let's also test creating a new hash
  const newHash = await bcrypt.hash(password, 10);
  console.log('New hash:', newHash);
  
  const newResult = await bcrypt.compare(password, newHash);
  console.log('New hash comparison result:', newResult);
}

testBcrypt();
