import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ClinicPatientDocument = HydratedDocument<ClinicPatient>;

export enum PatientGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  UNSPECIFIED = 'UNSPECIFIED',
}

@Schema({ timestamps: true, collection: 'clinic_patients' })
export class ClinicPatient {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  doctorId!: Types.ObjectId;

  /** Human-readable Medical Record Number, e.g. MC-2026-000123 */
  @Prop({ required: true, unique: true, index: true })
  mrn!: string;

  @Prop({ required: true, trim: true })
  firstName!: string;

  @Prop({ required: true, trim: true })
  lastName!: string;

  @Prop({ lowercase: true, trim: true })
  email?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({ enum: PatientGender, default: PatientGender.UNSPECIFIED })
  gender!: PatientGender;

  @Prop({ trim: true })
  bloodGroup?: string;

  @Prop({ trim: true })
  addressLine1?: string;

  @Prop({ trim: true })
  city?: string;

  @Prop({ trim: true })
  state?: string;

  @Prop({ trim: true })
  pincode?: string;

  @Prop({ trim: true })
  emergencyName?: string;

  @Prop({ trim: true })
  emergencyPhone?: string;

  @Prop({ type: [String], default: [] })
  allergies!: string[];

  @Prop({ type: [String], default: [] })
  chronicConditions!: string[];

  @Prop({ type: [String], default: [] })
  currentMedications!: string[];

  @Prop({ trim: true })
  clinicalNotes?: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export const ClinicPatientSchema = SchemaFactory.createForClass(ClinicPatient);
ClinicPatientSchema.index({ doctorId: 1, lastName: 1, firstName: 1 });
ClinicPatientSchema.index({ doctorId: 1, phone: 1 });
