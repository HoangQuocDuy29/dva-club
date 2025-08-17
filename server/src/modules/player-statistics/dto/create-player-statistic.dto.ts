import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePlayerStatisticsDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  playerId: number;

  @ApiProperty({ example: "2024-2025" })
  @IsString()
  @IsNotEmpty()
  season: string;

  @ApiPropertyOptional({ example: "Championship League" })
  @IsOptional()
  @IsString()
  tournament?: string;

  @ApiPropertyOptional({ example: 15, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  matchesPlayed?: number;

  @ApiPropertyOptional({ example: 150, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  totalPoints?: number;

  // Serving Statistics
  @ApiPropertyOptional({ example: 45, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  servesAttempted?: number;

  @ApiPropertyOptional({ example: 38, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  servesSuccessful?: number;

  @ApiPropertyOptional({ example: 12, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  aces?: number;

  @ApiPropertyOptional({ example: 7, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  serviceErrors?: number;

  // Attacking Statistics
  @ApiPropertyOptional({ example: 85, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  attacksAttempted?: number;

  @ApiPropertyOptional({ example: 68, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  attacksSuccessful?: number;

  @ApiPropertyOptional({ example: 54, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  kills?: number;

  @ApiPropertyOptional({ example: 17, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  attackErrors?: number;

  // Blocking Statistics
  @ApiPropertyOptional({ example: 8, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  blocksSolo?: number;

  @ApiPropertyOptional({ example: 15, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  blocksAssisted?: number;

  @ApiPropertyOptional({ example: 3, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  blockErrors?: number;

  // Defensive Statistics
  @ApiPropertyOptional({ example: 42, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  digs?: number;

  @ApiPropertyOptional({ example: 28, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  receptions?: number;

  @ApiPropertyOptional({ example: 5, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  receptionErrors?: number;

  // Setting Statistics
  @ApiPropertyOptional({ example: 120, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  setsAttempted?: number;

  @ApiPropertyOptional({ example: 95, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  assists?: number;

  @ApiPropertyOptional({ example: 8, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  settingErrors?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isCurrentSeason?: boolean;

  @ApiPropertyOptional({ example: "Excellent performance this season" })
  @IsOptional()
  @IsString()
  notes?: string;
}
