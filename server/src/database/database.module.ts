//E:\2_NodeJs\DVA_Club\volleyball-club-management\server\src\database\database.module.ts
import { Module, Global, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  AppDataSource,
  initializeDatabase,
  closeDatabase,
} from "./data-source";
import * as entities from "../entities";

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST", "localhost"),
        port: configService.get<number>("DB_PORT", 5432),
        username: configService.get<string>("DB_USERNAME", "postgres"),
        password: configService.get<string>("DB_PASSWORD", "123456"),
        database: configService.get<string>("DB_NAME", "dvaclub"),

        // Entity configuration
        entities: Object.values(entities),

        // Development settings
        synchronize: configService.get<string>("NODE_ENV") !== "production",

        // ✅ DETAILED LOGGING FOR DEBUG
        logging:
          configService.get<string>("NODE_ENV") === "development"
            ? "all" // Enable ALL queries including soft delete operations
            : ["error"],

        // ✅ ADVANCED CONSOLE LOGGER WITH DETAILS
        logger: "advanced-console",

        // ✅ LOG SLOW QUERIES FOR DEBUGGING
        maxQueryExecutionTime: 100, // Log queries taking > 100ms

        // Connection pool settings with timezone
        extra: {
          connectionLimit: 10,
          acquireTimeout: 60000,
          timeout: 60000,
          timezone: "Asia/Ho_Chi_Minh",
        },

        // Migration settings
        migrations: ["dist/database/migrations/*.js"],
        migrationsRun: false,
        migrationsTableName: "typeorm_migrations",

        // SSL configuration for production
        ssl:
          configService.get<string>("NODE_ENV") === "production"
            ? {
                rejectUnauthorized: false,
              }
            : false,

        // Auto-load entities
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    // Register all entity repositories
    TypeOrmModule.forFeature(Object.values(entities)),
  ],
  providers: [
    {
      provide: "DATA_SOURCE",
      useValue: AppDataSource,
    },
  ],
  exports: [TypeOrmModule, "DATA_SOURCE"],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      console.log("🔄 Initializing database connection...");
      await initializeDatabase();

      // Set timezone explicitly after connection
      const dataSource = AppDataSource;
      if (dataSource.isInitialized) {
        await dataSource.query("SET timezone = 'Asia/Ho_Chi_Minh'");
      }

      console.log("✅ Database module initialized successfully");

      // ✅ FIX: Use this.configService instead of configService
      if (this.configService.get<string>("NODE_ENV") === "development") {
        console.log("🔍 Database configuration:", {
          host: this.configService.get<string>("DB_HOST", "localhost"),
          port: this.configService.get<number>("DB_PORT", 5432),
          database: this.configService.get<string>("DB_NAME", "dvaclub"),
          logging: "all",
          entities: Object.keys(entities).length,
        });
      }
    } catch (error) {
      console.error("❌ Failed to initialize database module:", error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      console.log("🔄 Closing database connection...");
      await closeDatabase();
      console.log("✅ Database module destroyed successfully");
    } catch (error) {
      console.error("❌ Error during database module destruction:", error);
    }
  }
}
