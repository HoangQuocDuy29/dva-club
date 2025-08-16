import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  IsDateString,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AddTeamMemberDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  playerId: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  jerseyNumber?: number;

  @ApiPropertyOptional({
    example: "setter",
    enum: ["setter", "outside_hitter", "middle_blocker", "opposite", "libero"],
  })
  @IsOptional()
  @IsEnum(["setter", "outside_hitter", "middle_blocker", "opposite", "libero"])
  position?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isCaptain?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isViceCaptain?: boolean;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isStartingLineup?: boolean;

  @ApiPropertyOptional({
    example: "active",
    enum: ["active", "inactive", "suspended", "transferred"],
    default: "active",
  })
  @IsOptional()
  @IsEnum(["active", "inactive", "suspended", "transferred"])
  status?: string;

  @ApiPropertyOptional({ example: "2025-01-15" })
  @IsOptional()
  @IsDateString()
  joinedDate?: string;

  @ApiPropertyOptional({ example: "Team captain material" })
  @IsOptional()
  @IsString()
  notes?: string;
}
