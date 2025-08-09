import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as entities from '../entities';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '123456',
  database: process.env.DATABASE_NAME || 'dvaclub',
  
  entities: Object.values(entities),
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    timezone: 'Asia/Ho_Chi_Minh',
  },
  
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: false,
  migrationsTableName: 'typeorm_migrations',
  subscribers: ['src/database/subscribers/*.ts'],
  
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
});

// Keep all your existing functions
export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      await AppDataSource.query("SET timezone = 'Asia/Ho_Chi_Minh'");
      console.log('✅ Database connection initialized successfully');
    }
  } catch (error) {
    console.error('❌ Error during Data Source initialization:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✅ Database connection closed successfully');
    }
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
};

export const getRepository = <T>(entity: any) => {
  return AppDataSource.getRepository<T>(entity);
};

export default AppDataSource;
