import { IsOptional, IsString, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PlayerPerformanceAnalysisDto {
  @ApiPropertyOptional({ example: "2024-2025" })
  @IsOptional()
  @IsString()
  season?: string;

  @ApiPropertyOptional({ example: "Championship League" })
  @IsOptional()
  @IsString()
  tournament?: string;

  @ApiPropertyOptional({
    example: "Setter",
    enum: ["Setter", "Libero", "Outside Hitter", "Middle Blocker", "Opposite"],
  })
  @IsOptional()
  @IsEnum(["Setter", "Libero", "Outside Hitter", "Middle Blocker", "Opposite"])
  position?: string;

  @ApiPropertyOptional({
    example: "serves",
    enum: ["serves", "attacks", "blocks", "defense", "setting"],
  })
  @IsOptional()
  @IsEnum(["serves", "attacks", "blocks", "defense", "setting"])
  metric?: string;
}
