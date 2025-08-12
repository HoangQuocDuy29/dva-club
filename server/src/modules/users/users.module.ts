//E:\2_NodeJs\DVA_Club\volleyball-club-management\server\src\modules\users\users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as multer from 'multer';
import * as path from 'path';

// Import entities từ thư mục entities có sẵn
import { User } from '../../entities/user.entity';
import { UserProfile } from '../../entities/user-profile.entity';

// Import module components
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';

@Module({
  imports: [
    // TypeORM entities registration
    TypeOrmModule.forFeature([User, UserProfile]),
    
    // Multer configuration for file uploads
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: multer.diskStorage({
          destination: (req, file, cb) => {
            // Create avatar upload path with date structure
            const uploadPath = path.join(
              process.cwd(), 
              'storage/uploads/users/avatars',
              new Date().toISOString().slice(0, 7).replace('-', '/') // 2025/01
            );
            
            const fs = require('fs');
            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }
            
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const userId = req.params.id;
            const timestamp = Date.now();
            const extension = path.extname(file.originalname);
            const filename = `user-${userId}-avatar-${timestamp}${extension}`;
            cb(null, filename);
          },
        }),
        fileFilter: (req, file, cb) => {
          // Allow only image files
          if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed!'), false);
          }
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
  ],
  exports: [
    UsersService,
    UsersRepository,
  ],
})
export class UsersModule {}
