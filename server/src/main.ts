import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { initializeDatabase } from './database/data-source';

async function bootstrap() {
  try {
    // Initialize database
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database connected');
    
    // Create app
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    
    // Validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    // CORS
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
    });
    
    // API prefix
    app.setGlobalPrefix('api/v1');
    
    // Swagger
    const config = new DocumentBuilder()
      .setTitle('Volleyball Club API')
      .setDescription('Volleyball Club Management System API')
      .setVersion('1.0.0')
      .addTag('Authentication', 'Auth endpoints')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    
    // Start server
    const port = configService.get<number>('SERVER_PORT', 3001);
    await app.listen(port);
    
    console.log(`🚀 Server running: http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

bootstrap();
