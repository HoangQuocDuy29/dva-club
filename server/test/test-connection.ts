// test/test-connection.ts - Fixed version
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing database connection...');
  console.log('Host:', process.env.DATABASE_HOST || process.env.DB_HOST);
  console.log('Port:', process.env.DATABASE_PORT || process.env.DB_PORT);
  console.log('User:', process.env.DATABASE_USERNAME || process.env.DB_USERNAME);
  console.log('Database:', process.env.DATABASE_NAME || process.env.DB_DATABASE);

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || process.env.DB_USERNAME,
    password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME || process.env.DB_DATABASE,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection successful!');
    
    // Test query
    const result = await dataSource.query('SELECT NOW()');
    console.log('Current time from DB:', result[0].now);
    
    await dataSource.destroy();
  } catch (error) {
    // ✅ FIXED: Proper error handling with type checking
    console.error('❌ Database connection failed:', 
      error instanceof Error ? error.message : String(error));
  }
}

testConnection();
