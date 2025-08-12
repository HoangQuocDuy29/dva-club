// Create debug-env.ts
import * as dotenv from 'dotenv';
dotenv.config();

console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('All JWT env vars:');
Object.keys(process.env)
  .filter(key => key.includes('JWT'))
  .forEach(key => console.log(`${key}:`, process.env[key]));
