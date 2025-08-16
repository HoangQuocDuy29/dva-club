import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ListPlayersDto {
  @ApiPropertyOptional({ example: "Quốc Duy" })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ["male", "female"] })
  @IsOptional()
  @IsEnum(["male", "female"])
  gender?: string;

  @ApiPropertyOptional({
    enum: [
      "Setter",
      "Outside Hitter",
      "Middle Blocker",
      "Opposite",
      "Libero",
      "Defensive Specialist",
    ],
  })
  @IsOptional()
  @IsEnum([
    "Setter",
    "Outside Hitter",
    "Middle Blocker",
    "Opposite",
    "Libero",
    "Defensive Specialist",
  ])
  position?: string;

  @ApiPropertyOptional({
    enum: ["beginner", "middle", "advanced", "professional"],
  })
  @IsOptional()
  @IsEnum(["beginner", "middle", "advanced", "professional"])
  skillLevel?: string;

  @ApiPropertyOptional({ enum: ["active", "inactive", "injured", "suspended"] })
  @IsOptional()
  @IsEnum(["active", "inactive", "injured", "suspended"])
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
