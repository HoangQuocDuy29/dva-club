import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListMediaDto {
  @ApiPropertyOptional({
    description: "Search by filename or description",
    example: "profile",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ["player", "team", "tournament", "match", "user", "news"],
    description: "Filter by entity type",
  })
  @IsOptional()
  @IsEnum(["player", "team", "tournament", "match", "user", "news"])
  entityType?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  entityId?: number;

  @ApiPropertyOptional({ enum: ["image", "video", "document"] })
  @IsOptional()
  @IsEnum(["image", "video", "document"])
  mediaType?: string;

  @ApiPropertyOptional({
    enum: ["profile", "action", "team_photo", "logo", "banner", "document"],
  })
  @IsOptional()
  @IsEnum(["profile", "action", "team_photo", "logo", "banner", "document"])
  mediaCategory?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  uploadedBy?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
