import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { ConsultationType } from '../schemas/appointment.schema';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Doctor user id' })
  @IsString()
  @MinLength(1)
  doctorId!: string;

  @ApiProperty({ enum: ConsultationType })
  @IsEnum(ConsultationType)
  consultationType!: ConsultationType;

  @ApiProperty({ example: '2026-10-30T16:30:00.000Z' })
  @IsString()
  startsAt!: string;

  @ApiProperty({ example: 800 })
  @IsInt()
  @Min(0)
  feeInr!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clinicName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiptNumber?: string;
}
