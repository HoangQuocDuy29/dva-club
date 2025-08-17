import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly maxSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
  ];

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException("File too large. Max size is 10MB");
    }

    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        "Invalid file type. Only JPG, PNG, WEBP, MP4 allowed"
      );
    }

    return file;
  }
}
