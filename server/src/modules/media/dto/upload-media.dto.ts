import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UploadMediaDto {
  @ApiProperty({
    enum: ["player", "team", "tournament", "match", "user", "news"],
    description: "Type of entity the media belongs to",
    example: "player",
  })
  @IsEnum(["player", "team", "tournament", "match", "user", "news"])
  entityType: string;

  @ApiProperty({
    description: "ID of the entity",
    example: 1,
    type: "integer",
  })
  @Type(() => Number)
  @IsInt()
  entityId: number;

  @ApiPropertyOptional({
    enum: ["profile", "action", "team_photo", "logo", "banner", "document"],
    description: "Category of the media file",
    example: "profile",
  })
  @IsOptional()
  @IsEnum(["profile", "action", "team_photo", "logo", "banner", "document"])
  mediaCategory?: string;

  @ApiPropertyOptional({
    description: "Description of the media file",
    example: "Player profile photo taken during training session",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: "Alternative text for accessibility",
    example: "Player John Doe in volleyball uniform",
  })
  @IsOptional()
  @IsString()
  altText?: string;
}
