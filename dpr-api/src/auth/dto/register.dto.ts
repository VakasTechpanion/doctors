import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class RegisterDto {
  @ApiProperty({ example: 'ananya@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'SecurePass1' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'Ananya' })
  @IsString()
  @MinLength(1)
  firstName!: string;

  @ApiProperty({ example: 'Sharma' })
  @IsString()
  @MinLength(1)
  lastName!: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  @Matches(/^[+0-9\s-]{7,20}$/, { message: 'phone must be a valid phone number' })
  phone?: string;

  @ApiProperty({ enum: [UserRole.PATIENT, UserRole.DOCTOR, UserRole.CLINIC_OWNER] })
  @IsEnum(UserRole)
  role!: UserRole.PATIENT | UserRole.DOCTOR | UserRole.CLINIC_OWNER;
}
