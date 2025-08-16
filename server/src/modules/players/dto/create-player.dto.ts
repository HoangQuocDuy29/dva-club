import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  IsNumber,
  IsArray,
  IsObject,
  Min,
  Max,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreatePlayerDto {
  // UserId
  @ApiPropertyOptional({ example: 1 }) // tùy chọn và mô tả thuộc tính cho Swagger
  @IsOptional() // Xác nhận rằng trường này là tùy chọn (không bắt buộc)
  @Type(() => Number) // Chuyển đổi dữ liệu đầu vào thành số
  @IsInt() // Xác thực rằng giá trị là một số nguyên
  @Min(0)
  @Max(10000)
  userId?: number;

  //playerCode
  @ApiPropertyOptional({ example: "PL-2025-001" })
  @IsOptional()
  @IsString()
  playerCode?: string;

  //fullName
  @ApiPropertyOptional({ example: "Hoàng Quốc Duy" })
  @IsString() // Phải là chuỗi
  @IsNotEmpty() // không được để trống
  fullName?: string;

  //gender
  @ApiPropertyOptional({ example: "male", enum: ["male", "female"] })
  @IsEnum(["male", "female"]) // Chỉ chấp nhận giá trị cụ thể
  gender?: string;

  //dateOfBirth
  @ApiPropertyOptional({ example: "2003-01-29" })
  @IsDateString() // Phải là ngày
  dateOfBirth?: string;

  //height
  @ApiPropertyOptional({ example: 175 })
  @Transform(({ value }) => {
    if (!value) return undefined;
    const num = Number(value);
    return isNaN(num) ? value : num;
  })
  @IsNumber()
  @Min(150)
  @Max(200)
  height?: number;

  // weight
  @ApiPropertyOptional({ example: 75 })
  @Type(() => Number)
  @IsInt()
  @Min(40)
  @Max(110)
  weight?: number;

  //dominantHand
  @ApiPropertyOptional({
    example: "right",
    enum: ["left", "right", "ambidextrous"],
  })
  @IsEnum(["left", "right", "ambidextrous"])
  dominantHand?: string;

  // jerseyNumber
  @ApiPropertyOptional({ example: 10 })
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(99)
  jerseyNumber?: number;

  //primaryPosition
  @ApiPropertyOptional({
    example: "Setter",
    enum: [
      "Setter",
      "Outside Hitter",
      "Middle Blocker",
      "Opposite",
      "Libero",
      "Full",
    ],
  })
  @IsEnum([
    "Setter",
    "Outside Hitter",
    "Middle Blocker",
    "Opposite",
    "Libero",
    "Full",
  ])
  primaryPosition?: string;

  //secondaryPositions
  @ApiPropertyOptional({
    example: ["Outside Hitter", "Opposite"],
    enum: [
      "Setter",
      "Outside Hitter",
      "Middle Blocker",
      "Opposite",
      "Libero",
      "Full",
    ],
  })
  @IsEnum(
    ["Setter", "Outside Hitter", "Middle Blocker", "Opposite", "Libero"],
    { each: true }
  )
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  secondaryPositions?: string[];

  // skillLevel
  @ApiPropertyOptional({
    example: "middle",
    enum: ["beginner", "middle", "advanced", "professional"],
    default: "beginner",
  })
  @IsEnum(["beginner", "middle", "advanced", "professional"])
  skillLevel: string;

  //contactInfo
  @ApiPropertyOptional({
    example: { email: "john@example.com", phone: "+88768299329" },
  })
  @IsObject()
  contactInfo: Record<string, any>;

  //avatarUrl
  @ApiPropertyOptional({ example: "https://example.com/avatar.jpg" })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  //actionPhotos
  @ApiPropertyOptional({
    example: [
      "https://example.com/action1.jpg",
      "https://example.com/action2.jpg",
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  actionPhotos?: string[];

  //status
  @ApiPropertyOptional({
    example: "active",
    enum: ["active", "inactive", "injured", "suspended"],
    default: "active",
  })
  @IsOptional()
  @IsEnum(["active", "inactive", "injured", "suspended"])
  status?: string;

  //injuryDetails
  @ApiPropertyOptional({ example: "Minor ankle sprain, recovering" })
  @IsOptional()
  @IsString()
  injuryDetails?: string;

  //medicalNotes
  @ApiPropertyOptional({ example: "No known allergies" })
  @IsOptional()
  @IsString()
  medicalNotes?: string;

  //joinDate
  @ApiPropertyOptional({ example: "2025-01-15" })
  @IsDateString()
  joinDate: string;

  //notes
  @ApiPropertyOptional({ example: "Very dedicated player, good team spirit" })
  @IsOptional()
  @IsString()
  notes?: string;
}
