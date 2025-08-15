import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListDivisionsDto {
  @ApiPropertyOptional({ example: "Professional" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ["amateur", "semi_professional", "professional"],
  })
  @IsOptional()
  @IsEnum(["amateur", "semi_professional", "professional"])
  level?: string;

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
