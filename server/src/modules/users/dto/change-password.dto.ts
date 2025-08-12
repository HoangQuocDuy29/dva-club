import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'New password',
    example: 'NewStrongPass123!',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'NewStrongPass123!'
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
