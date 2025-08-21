//E:\2_NodeJs\DVA_Club\volleyball-club-management\server\src\cloudinary\cloudinary.provider.ts
import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "./cloudinary.provider";
import { CloudinaryService } from "./cloudinary.service";

@Module({
  providers: [CloudinaryProvider, CloudinaryService],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
