//E:\2_NodeJs\DVA_Club\volleyball-club-management\server\src\database\cli-data-source.ts
import { DataSource } from "typeorm";
import { config } from "dotenv";
import * as entities from "../entities";

// Load environment variables
config();

// CLI Data Source - Only one export for TypeORM CLI
export default new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD || "123456",
  database: process.env.DATABASE_NAME || "dvaclub",

  // Entity configuration
  entities: Object.values(entities),

  // Development settings
  synchronize: false, // ✅ Always false for CLI
  logging: ["query", "error", "warn"],

  // Connection settings
  extra: {
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    timezone: "Asia/Ho_Chi_Minh",
  },

  // Migration settings
  migrations: ["src/database/migrations/*.ts"],
  migrationsTableName: "typeorm_migrations",
});
