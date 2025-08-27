// main.ts - ✅ REMOVE useStaticAssets configuration
import { NestFactory } from "@nestjs/core";
import { ValidationPipe, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { initializeDatabase } from "./database/data-source";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
async function bootstrap() {
  try {
    console.log("🔄 Initializing database...");
    await initializeDatabase();
    console.log("✅ Database connected");

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);

    // ✅ Global Exception Filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Enhanced validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
          const details = errors.reduce((acc, error) => {
            const field = error.property;
            const constraints = error.constraints
              ? Object.values(error.constraints)
              : [];

            acc.push({
              field,
              value: error.value,
              constraints: error.constraints || {},
              messages: constraints,
            });

            return acc;
          }, []);

          return new HttpException(
            {
              message: "Validation failed",
              details,
            },
            HttpStatus.BAD_REQUEST
          );
        },
      })
    );

    // CORS
    app.enableCors({
      origin: [
        "http://localhost:5173",
        "http://localhost:3001",
        "http://127.0.0.1:5173",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
      ],
      credentials: true,
    });

    // API prefix
    app.setGlobalPrefix("api/v1");

    // Swagger configuration
    const config = new DocumentBuilder()
      .setTitle("Volleyball Club API")
      .setDescription("Volleyball Club Management System API")
      .setVersion("1.0.0")
      .addTag("Authentication", "Auth endpoints")
      .addTag("Users", "User management endpoints")
      .addBearerAuth()
      .addServer("http://localhost:3001", "Development server")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);

    // Start server
    const port = configService.get<number>("SERVER_PORT", 3001);
    await app.listen(port);

    console.log(`🚀 Server running: http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
    console.log(`📁 Static files: http://localhost:${port}/storage/`);
    console.log(`🛡️  Global Exception Filter: Enabled`);
    console.log(`✅ ServeStaticModule: Enabled`);
  } catch (error) {
    console.error("❌ Bootstrap Error:", error);
    process.exit(1);
  }
}

bootstrap();
