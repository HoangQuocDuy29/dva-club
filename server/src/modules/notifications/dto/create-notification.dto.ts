import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsObject,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateNotificationDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  recipientId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  senderId?: number;

  @ApiProperty({
    example: "tournament_registration",
    enum: [
      "tournament_registration",
      "match_result",
      "team_invitation",
      "system_announcement",
      "player_transfer",
      "match_schedule",
    ],
  })
  @IsEnum([
    "tournament_registration",
    "match_result",
    "team_invitation",
    "system_announcement",
    "player_transfer",
    "match_schedule",
  ])
  notificationType: string;

  @ApiProperty({ example: "Tournament Registration Approved" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: "Your registration for Championship 2025 has been approved.",
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ example: "/tournaments/1/details" })
  @IsOptional()
  @IsString()
  actionUrl?: string;

  @ApiPropertyOptional({
    example: "tournament",
    enum: ["tournament", "match", "team", "player", "application"],
  })
  @IsOptional()
  @IsEnum(["tournament", "match", "team", "player", "application"])
  entityType?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  entityId?: number;

  @ApiPropertyOptional({
    example: { tournamentName: "Championship 2025", teamName: "Team Dragons" },
    description: "Additional metadata",
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    example: "normal",
    enum: ["low", "normal", "high", "urgent"],
    default: "normal",
  })
  @IsOptional()
  @IsEnum(["low", "normal", "high", "urgent"])
  priority?: string;

  @ApiPropertyOptional({ example: "2025-12-31T23:59:59Z" })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}
