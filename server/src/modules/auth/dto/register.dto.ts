import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  Matches, 
  IsOptional, 
  IsEnum,
  IsPhoneNumber 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'johndoe123',
    minLength: 3,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @ApiProperty({
    description: 'User password (must contain uppercase, lowercase, number, and special character)',
    example: 'StrongPass123!',
    minLength: 8,
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+84123456789',
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'User role in the volleyball club',
    example: 'player',
    enum: ['player', 'coach', 'manager', 'viewer'],
    default: 'viewer',
  })
  @IsOptional()
  @IsEnum(['player', 'coach', 'manager', 'viewer'], { 
    message: 'Role must be one of: player, coach, manager, viewer' 
  })
  role?: string;
}
