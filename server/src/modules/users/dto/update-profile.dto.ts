// dto/update-profile.dto.ts - NEW DTO for profile updates
import { IsOptional, IsString, IsDateString, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Date of birth',
    example: '1990-05-15'
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Gender',
    example: 'male',
    enum: ['male', 'female', 'other']
  })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: '123 Volleyball Street, Ho Chi Minh City'
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact information',
    example: {
      name: 'Jane Doe',
      phone: '+84123456789',
      relationship: 'spouse'
    }
  })
  @IsOptional()
  @IsObject()
  emergencyContact?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Biography/Description',
    example: 'Passionate volleyball player with 5 years experience'
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Social media links',
    example: {
      facebook: 'https://facebook.com/johndoe',
      instagram: '@johndoe_volleyball',
      twitter: '@johndoe'
    }
  })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, any>;
}
