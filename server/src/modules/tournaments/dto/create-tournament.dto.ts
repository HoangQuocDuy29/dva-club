import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsDateString,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTournamentDto {
  @ApiProperty({ example: "Championship 2025" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "CHAMP-2025" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: "Annual volleyball championship" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "knockout",
    enum: ["league", "knockout", "round_robin"],
  })
  @IsEnum(["league", "knockout", "round_robin"])
  type: string;

  @ApiProperty({
    example: "national",
    enum: ["local", "regional", "national", "international"],
  })
  @IsEnum(["local", "regional", "national", "international"])
  level: string;

  @ApiPropertyOptional({
    example: "draft",
    enum: ["draft", "registration_open", "ongoing", "completed", "cancelled"],
    default: "draft",
  })
  @IsOptional()
  @IsEnum(["draft", "registration_open", "ongoing", "completed", "cancelled"])
  status?: string;

  @ApiProperty({ example: 16 })
  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(64)
  maxTeams: number;

  @ApiPropertyOptional({ example: 100.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  registrationFee?: number;

  @ApiPropertyOptional({ example: 10000.0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prizeMoney?: number;

  @ApiPropertyOptional({ example: "National Sports Complex" })
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiProperty({ example: "2025-09-01" })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: "2025-09-15" })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: "2025-08-01" })
  @IsDateString()
  registrationStartDate: string;

  @ApiProperty({ example: "2025-08-25" })
  @IsDateString()
  registrationEndDate: string;

  @ApiPropertyOptional({ example: "tournament@example.com" })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ example: "+1234567890" })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: "Standard volleyball rules apply" })
  @IsOptional()
  @IsString()
  rules?: string;

  @ApiPropertyOptional({ example: "Teams must have 12-15 players" })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional({ example: "https://example.com/banner.jpg" })
  @IsOptional()
  @IsString()
  bannerImageUrl?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
