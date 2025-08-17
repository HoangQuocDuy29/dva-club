import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MediaFile } from "../../entities/media-file.entity";
import { User } from "../../entities/user.entity";
import { CloudinaryModule } from "../../cloudinary/cloudinary.module";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaFile, User]),
    CloudinaryModule, // Import Cloudinary for file uploads
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService], // Export for other modules to use
})
export class MediaModule {}
