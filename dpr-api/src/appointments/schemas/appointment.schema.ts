import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

export enum ConsultationType {
  IN_CLINIC = 'IN_CLINIC',
  ONLINE = 'ONLINE',
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

@Schema({ timestamps: true, collection: 'appointments' })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  doctorId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  patientId!: Types.ObjectId;

  @Prop({ required: true })
  doctorName!: string;

  @Prop({ required: true })
  patientName!: string;

  @Prop()
  specialty?: string;

  @Prop()
  clinicName?: string;

  @Prop({ required: true, enum: ConsultationType })
  consultationType!: ConsultationType;

  @Prop({ required: true, enum: AppointmentStatus, default: AppointmentStatus.CONFIRMED })
  status!: AppointmentStatus;

  @Prop({ required: true, index: true })
  startsAt!: Date;

  @Prop({ required: true })
  endsAt!: Date;

  @Prop({ required: true, min: 0 })
  feeInr!: number;

  @Prop({ default: 0, min: 0 })
  platformFeeInr!: number;

  @Prop()
  receiptNumber?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
AppointmentSchema.index({ doctorId: 1, startsAt: 1 });
AppointmentSchema.index({ patientId: 1, startsAt: 1 });
