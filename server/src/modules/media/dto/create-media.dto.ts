import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsBoolean,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateMediaDto {
  @ApiProperty({
    description: "Original filename",
    example: "player-photo.jpg",
  })
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty({ example: "My Profile Photo.jpg" })
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @ApiProperty({ example: "/uploads/players/profile-photo-123.jpg" })
  @IsString()
  @IsNotEmpty()
  filePath: string;

  @ApiProperty({
    description: "File URL from cloud storage",
    example:
      "https://res.cloudinary.com/club/image/upload/v123/player-photo.jpg",
  })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({ example: "image/jpeg" })
  @IsString()
  @IsNotEmpty()
  mimeType: string;

  @ApiProperty({ example: 1048576 })
  @Type(() => Number)
  @IsInt()
  fileSize: number;

  @ApiProperty({
    example: "player",
    enum: ["player", "team", "tournament", "match", "user", "news"],
  })
  @IsEnum(["player", "team", "tournament", "match", "user", "news"])
  entityType: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  entityId: number;

  @ApiProperty({
    example: "image",
    enum: ["image", "video", "document"],
  })
  @IsEnum(["image", "video", "document"])
  mediaType: string;

  @ApiPropertyOptional({
    example: "profile",
    enum: ["profile", "action", "team_photo", "logo", "banner", "document"],
  })
  @IsOptional()
  @IsEnum(["profile", "action", "team_photo", "logo", "banner", "document"])
  mediaCategory?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  uploadedBy: number;

  @ApiPropertyOptional({
    example: "Player profile photo taken during training",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: { width: 800, height: 600, format: "jpeg" },
    description: "File metadata like dimensions, duration, etc.",
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ example: "Player profile photo" })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  displayOrder?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
