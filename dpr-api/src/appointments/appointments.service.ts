import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument, UserRole } from '../users/schemas/user.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  Appointment,
  AppointmentDocument,
  AppointmentStatus,
  ConsultationType,
} from './schemas/appointment.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createForPatient(patientId: string, dto: CreateAppointmentDto) {
    if (!Types.ObjectId.isValid(dto.doctorId) || !Types.ObjectId.isValid(patientId)) {
      throw new BadRequestException('Invalid doctor or patient id');
    }

    const [doctor, patient] = await Promise.all([
      this.userModel.findById(dto.doctorId),
      this.userModel.findById(patientId),
    ]);

    if (!doctor || doctor.role !== UserRole.DOCTOR) {
      throw new NotFoundException('Doctor not found');
    }
    if (!patient || patient.role !== UserRole.PATIENT) {
      throw new ForbiddenException('Only patients can book appointments');
    }

    const startsAt = new Date(dto.startsAt);
    if (Number.isNaN(startsAt.getTime())) {
      throw new BadRequestException('Invalid startsAt');
    }
    const endsAt = new Date(startsAt.getTime() + 30 * 60 * 1000);
    const platformFeeInr = Math.round((dto.feeInr * 500) / 10000);

    const appointment = await this.appointmentModel.create({
      doctorId: doctor._id,
      patientId: patient._id,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      patientName: `${patient.firstName} ${patient.lastName}`,
      specialty: dto.specialty,
      clinicName: dto.clinicName,
      consultationType: dto.consultationType,
      status: AppointmentStatus.CONFIRMED,
      startsAt,
      endsAt,
      feeInr: dto.feeInr,
      platformFeeInr,
      receiptNumber: dto.receiptNumber,
    });

    return this.toView(appointment);
  }

  async getDoctorDashboard(doctorId: string) {
    const doctor = await this.userModel.findById(doctorId);
    if (!doctor || (doctor.role !== UserRole.DOCTOR && doctor.role !== UserRole.CLINIC_OWNER)) {
      throw new ForbiddenException('Doctor access only');
    }

    const { start, end } = this.todayRange();
    const todays = await this.appointmentModel
      .find({
        doctorId: doctor._id,
        startsAt: { $gte: start, $lt: end },
        status: { $ne: AppointmentStatus.CANCELLED },
      })
      .sort({ startsAt: 1 })
      .lean();

    const completed = todays.filter((a) => a.status === AppointmentStatus.COMPLETED);
    const revenueTodayInr = todays
      .filter((a) =>
        [AppointmentStatus.COMPLETED, AppointmentStatus.CONFIRMED, AppointmentStatus.IN_PROGRESS].includes(
          a.status,
        ),
      )
      .reduce((sum, a) => sum + Math.max(0, a.feeInr - (a.platformFeeInr ?? 0)), 0);

    return {
      doctor: {
        id: String(doctor._id),
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        phone: doctor.phone,
        role: doctor.role,
      },
      stats: {
        todayCount: todays.length,
        completed: completed.length,
        revenueTodayInr,
      },
      schedule: todays.map((a) => ({
        id: String(a._id),
        time: this.formatTime(a.startsAt),
        patient: a.patientName,
        type: a.consultationType === ConsultationType.ONLINE ? 'Online' : 'In-clinic',
        status: this.statusLabel(a.status),
        feeInr: a.feeInr,
      })),
    };
  }

  async getPatientDashboard(patientId: string) {
    const patient = await this.userModel.findById(patientId);
    if (!patient || patient.role !== UserRole.PATIENT) {
      throw new ForbiddenException('Patient access only');
    }

    const now = new Date();
    const upcoming = await this.appointmentModel
      .find({
        patientId: patient._id,
        startsAt: { $gte: now },
        status: { $nin: [AppointmentStatus.CANCELLED, AppointmentStatus.PAYMENT_FAILED] },
      })
      .sort({ startsAt: 1 })
      .limit(20)
      .lean();

    const recent = await this.appointmentModel
      .find({
        patientId: patient._id,
        status: AppointmentStatus.COMPLETED,
      })
      .sort({ startsAt: -1 })
      .limit(10)
      .lean();

    return {
      patient: {
        id: String(patient._id),
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        role: patient.role,
      },
      upcomingAppointments: upcoming.map((a) => ({
        id: String(a._id),
        doctorName: a.doctorName,
        specialty: a.specialty ?? 'Consultation',
        when: a.startsAt.toISOString(),
        clinic: a.clinicName ?? '—',
        type: a.consultationType === ConsultationType.ONLINE ? 'Online' : 'In-clinic',
        status: this.statusLabel(a.status),
        feeInr: a.feeInr,
      })),
      recentVisits: recent.map((a) => ({
        id: String(a._id),
        doctorName: a.doctorName,
        when: a.startsAt.toISOString(),
        feeInr: a.feeInr,
      })),
    };
  }

  async listDoctors() {
    const doctors = await this.userModel
      .find({ role: UserRole.DOCTOR, isActive: true })
      .select('firstName lastName email phone createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return doctors.map((d) => ({
      id: String(d._id),
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      phone: d.phone,
    }));
  }

  async updateStatus(doctorId: string, appointmentId: string, status: AppointmentStatus) {
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) throw new NotFoundException('Appointment not found');
    if (String(appointment.doctorId) !== doctorId) {
      throw new ForbiddenException('Not your appointment');
    }
    appointment.status = status;
    await appointment.save();
    return this.toView(appointment);
  }

  private toView(a: AppointmentDocument) {
    return {
      id: String(a._id),
      doctorId: String(a.doctorId),
      patientId: String(a.patientId),
      doctorName: a.doctorName,
      patientName: a.patientName,
      specialty: a.specialty,
      clinicName: a.clinicName,
      consultationType: a.consultationType,
      status: a.status,
      startsAt: a.startsAt.toISOString(),
      endsAt: a.endsAt.toISOString(),
      feeInr: a.feeInr,
      platformFeeInr: a.platformFeeInr,
      receiptNumber: a.receiptNumber,
    };
  }

  private todayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end };
  }

  private formatTime(date: Date) {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  private statusLabel(status: AppointmentStatus) {
    switch (status) {
      case AppointmentStatus.IN_PROGRESS:
        return 'In progress';
      case AppointmentStatus.COMPLETED:
        return 'Completed';
      case AppointmentStatus.CANCELLED:
        return 'Cancelled';
      case AppointmentStatus.CHECKED_IN:
        return 'Checked in';
      case AppointmentStatus.NO_SHOW:
        return 'No show';
      case AppointmentStatus.PAYMENT_FAILED:
        return 'Payment failed';
      default:
        return 'Confirmed';
    }
  }
}
