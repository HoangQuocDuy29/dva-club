import { IsArray, IsEnum, IsInt } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class BulkActionDto {
  @ApiProperty({ example: [1, 2, 3, 4, 5] })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  notificationIds: number[];

  @ApiProperty({
    example: "mark_read",
    enum: ["mark_read", "mark_unread", "delete"],
  })
  @IsEnum(["mark_read", "mark_unread", "delete"])
  action: string;
}
