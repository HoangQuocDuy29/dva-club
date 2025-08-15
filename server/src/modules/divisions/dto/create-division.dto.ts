import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  IsBoolean,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateDivisionDto {
  @ApiProperty({ example: "Professional Men Division" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "PRO-MEN-2025" })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: "Professional level volleyball division" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "professional",
    enum: ["amateur", "semi_professional", "professional"],
  })
  @IsEnum(["amateur", "semi_professional", "professional"])
  level: string;

  @ApiPropertyOptional({
    example: "senior",
    enum: ["youth", "junior", "senior", "veteran"],
  })
  @IsOptional()
  @IsEnum(["youth", "junior", "senior", "veteran"])
  ageGroup?: string;

  @ApiPropertyOptional({ example: "male", enum: ["male", "female", "mixed"] })
  @IsOptional()
  @IsEnum(["male", "female", "mixed"])
  genderCategory?: string;

  @ApiPropertyOptional({ example: 16 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxTeams?: number;

  @ApiPropertyOptional({ example: "2025-03-01" })
  @IsOptional()
  @IsDateString()
  seasonStart?: string;

  @ApiPropertyOptional({ example: "2025-11-30" })
  @IsOptional()
  @IsDateString()
  seasonEnd?: string;

  @ApiPropertyOptional({ example: 150.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  registrationFee?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  displayOrder?: number;
}
