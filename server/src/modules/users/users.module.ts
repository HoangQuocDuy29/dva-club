//E:\2_NodeJs\DVA_Club\volleyball-club-management\server\src\modules\users\users.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as multer from "multer";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { CloudinaryModule } from "../../cloudinary/cloudinary.module";

// Import entities từ thư mục entities có sẵn
import { User } from "../../entities/user.entity";
import { UserProfile } from "../../entities/user-profile.entity";

// Import module components
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersRepository } from "./repositories/users.repository";

@Module({
  imports: [
    // TypeORM entities registration
    TypeOrmModule.forFeature([User, UserProfile]),

    CloudinaryModule,

    // ✅ UPDATED: Multer configuration for memory storage (Cloudinary upload)
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: multer.memoryStorage(), // ✅ CHANGED: Use memory storage for buffer access

        fileFilter: (req, file, cb) => {
          // Allow only image files
          if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            cb(null, true);
          } else {
            cb(new Error("Only image files are allowed!"), false);
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
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
