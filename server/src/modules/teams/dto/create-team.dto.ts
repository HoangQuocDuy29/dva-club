import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTeamDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  divisionId: number;

  @ApiProperty({ example: "Team Dragons" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: "DRG" })
  @IsOptional()
  @IsString()
  shortName?: string;

  @ApiProperty({ example: "DRG-001" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  level: number;

  @ApiPropertyOptional({ example: "Professional volleyball team" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 18, default: 18 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(30)
  maxMembers?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  coachId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  assistantCoachId?: number;

  @ApiPropertyOptional({ example: "https://example.com/logo.png" })
  @IsOptional()
  @IsString()
  teamLogoUrl?: string;

  @ApiPropertyOptional({ example: "#FF0000" })
  @IsOptional()
  @IsString()
  teamColor?: string;

  @ApiPropertyOptional({ example: "#0000FF" })
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiPropertyOptional({ example: "2020-01-15" })
  @IsOptional()
  @IsDateString()
  foundedDate?: string;

  @ApiPropertyOptional({ example: "National Sports Arena" })
  @IsOptional()
  @IsString()
  homeVenue?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}
