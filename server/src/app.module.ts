import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ✅ Import Auth Module
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    
    // Database module with all entities
    DatabaseModule,
    
    // ✅ Authentication module
    AuthModule,
    
    // Add your other feature modules here later
    // UserModule,
    // TeamModule,
    // TournamentModule,
    // etc.
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
