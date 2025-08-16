import {
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTournamentSquadDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  tournamentId: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  teamId: number;

  @ApiPropertyOptional({ example: "Team Dragons - Championship Squad" })
  @IsOptional()
  @IsString()
  squadName?: string;

  @ApiPropertyOptional({
    example: "registered",
    enum: ["registered", "confirmed", "withdrawn", "disqualified"],
    default: "registered",
  })
  @IsOptional()
  @IsEnum(["registered", "confirmed", "withdrawn", "disqualified"])
  status?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  seedNumber?: number;

  @ApiPropertyOptional({ example: "A" })
  @IsOptional()
  @IsString()
  groupAssignment?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  captainId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  coachId?: number;

  @ApiPropertyOptional({ example: "Strong team with good chemistry" })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
