import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  getHello(): string {
    return 'Volleyball Club Management API is running! 🏐';
  }

  async getHealthCheck() {
    try {
      const dbStatus = this.dataSource.isInitialized;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: dbStatus ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development',
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getDatabaseStatus() {
    try {
      // Test database connection
      await this.dataSource.query('SELECT NOW()');
      
      // Get entity information
      const entities = this.dataSource.entityMetadatas.map(entity => ({
        name: entity.name,
        tableName: entity.tableName,
        columns: entity.columns.length,
      }));

      return {
        status: 'connected',
        timestamp: new Date().toISOString(),
        entities: entities,
        totalEntities: entities.length,
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
