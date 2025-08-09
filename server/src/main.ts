import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { initializeDatabase } from './database/data-source';

async function bootstrap() {
  try {
    // Initialize database connection first
    console.log('🔄 Initializing database connection...');
    await initializeDatabase();
    console.log('✅ Database connection initialized successfully');
    
    // Create NestJS application
    console.log('🔄 Starting NestJS application...');
    const app = await NestFactory.create(AppModule);
    
    // Get config service
    const configService = app.get(ConfigService);
    
    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false, // ✅ THÊM: Show validation errors
    }));
    
    // CORS configuration
    const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
    app.enableCors({
      origin: corsOrigin.split(','), // ✅ SỬA: Support multiple origins
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // ✅ THÊM: Explicit methods
      allowedHeaders: ['Content-Type', 'Authorization'], // ✅ THÊM: Headers
    });
    
    // Global prefix for API routes
    app.setGlobalPrefix('api/v1'); // ✅ SỬA: Thêm version
    
    // Start server
    const port = configService.get<number>('SERVER_PORT', 3001);
    await app.listen(port);
    
    console.log(`🚀 Volleyball Club Management System started successfully!`);
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`✅ API available at http://localhost:${port}/api/v1`);
    console.log(`🏐 Environment: ${configService.get<string>('NODE_ENV', 'development')}`);
    
  } catch (error) {
    console.error('❌ Error starting application:', error);
    process.exit(1);
  }
}

bootstrap();
