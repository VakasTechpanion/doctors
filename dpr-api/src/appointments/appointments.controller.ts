import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from './schemas/appointment.schema';

type AuthRequest = Request & {
  user: { userId: string; email: string; role: UserRole };
};

@ApiTags('appointments')
@Controller()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('doctors/directory')
  @ApiOperation({ summary: 'List registered doctors from MongoDB' })
  listDoctors() {
    return this.appointmentsService.listDoctors();
  }

  @Get('doctors/me/dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logged-in doctor dashboard' })
  doctorDashboard(@Req() req: AuthRequest) {
    return this.appointmentsService.getDoctorDashboard(req.user.userId);
  }

  @Get('patients/me/dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logged-in patient dashboard' })
  patientDashboard(@Req() req: AuthRequest) {
    return this.appointmentsService.getPatientDashboard(req.user.userId);
  }

  @Post('appointments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Patient books an appointment' })
  create(@Req() req: AuthRequest, @Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.createForPatient(req.user.userId, dto);
  }

  @Patch('appointments/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Doctor updates appointment status' })
  updateStatus(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: { status: AppointmentStatus },
  ) {
    return this.appointmentsService.updateStatus(req.user.userId, id, body.status);
  }
}
