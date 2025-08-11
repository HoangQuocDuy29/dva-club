import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  NormalizeEmail, 
  NormalizeUsername, 
  IsStrongPassword, 
  IsValidRole,
  Trim 
} from '../../auth/decorators';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @NormalizeEmail()
  email: string;

  @ApiProperty({
    description: 'Username (must be unique)',
    example: 'johndoe123',
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @NormalizeUsername()
  username: string;

  @ApiProperty({
    description: 'User password (strong password required)',
    example: 'StrongPass123!',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Trim()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Trim()
  lastName: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+84123456789',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Trim()
  phone?: string;

  @ApiProperty({
    description: 'User role in volleyball club',
    example: 'player',
    enum: ['admin', 'manager', 'coach', 'player', 'viewer'],
  })
  @IsValidRole()
  role: string;
}
