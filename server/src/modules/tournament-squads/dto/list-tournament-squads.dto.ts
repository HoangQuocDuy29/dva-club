import { IsOptional, IsInt, IsEnum, IsString, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListTournamentSquadsDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tournamentId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  teamId?: number;

  @ApiPropertyOptional({
    enum: ["registered", "confirmed", "withdrawn", "disqualified"],
  })
  @IsOptional()
  @IsEnum(["registered", "confirmed", "withdrawn", "disqualified"])
  status?: string;

  @ApiPropertyOptional({ example: "A" })
  @IsOptional()
  @IsString()
  groupAssignment?: string;

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
