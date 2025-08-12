// test-password.js - Cập nhật với hash từ database
const bcrypt = require('bcrypt');

async function testPassword() {
  console.log('🔍 Testing password hash...');
  
  const plainPassword = 'Admin123!';
  console.log('Plain password:', plainPassword);
  
  // Hash từ database của bạn
  const hashFromDB = '$2b$12$LQv3c1yqBwlhjUCE6oQO7.8q8Rh4v8z4Cq4K8wWy1G4z8X0f2y4t6';
  console.log('Hash from DB:', hashFromDB);
  
  // Test validation
  const isValid = await bcrypt.compare(plainPassword, hashFromDB);
  console.log('Password validation result:', isValid);
  
  // Test với các password khác có thể
  const testPasswords = [
    'Admin123!',
    'admin123',
    'password',
    'volleyball123',
    'admin'
  ];
  
  console.log('\n--- Testing multiple passwords ---');
  for (const pwd of testPasswords) {
    const result = await bcrypt.compare(pwd, hashFromDB);
    console.log(`"${pwd}" → ${result ? '✅ MATCH' : '❌ NO MATCH'}`);
  }
}

testPassword().catch(console.error);
