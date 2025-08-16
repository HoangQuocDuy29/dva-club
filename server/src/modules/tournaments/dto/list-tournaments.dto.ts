import { IsOptional, IsEnum, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListTournamentsDto {
  @ApiPropertyOptional({ enum: ["league", "knockout", "round_robin"] })
  @IsOptional()
  @IsEnum(["league", "knockout", "round_robin"])
  type?: string;

  @ApiPropertyOptional({
    enum: ["local", "regional", "national", "international"],
  })
  @IsOptional()
  @IsEnum(["local", "regional", "national", "international"])
  level?: string;

  @ApiPropertyOptional({
    enum: ["draft", "registration_open", "ongoing", "completed", "cancelled"],
  })
  @IsOptional()
  @IsEnum(["draft", "registration_open", "ongoing", "completed", "cancelled"])
  status?: string;

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
