import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PatientDocumentRecord = HydratedDocument<PatientDocumentFile>;

export enum DocumentCategory {
  PRESCRIPTION = 'PRESCRIPTION',
  LAB_REPORT = 'LAB_REPORT',
  IMAGING = 'IMAGING',
  DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
  CONSENT = 'CONSENT',
  VISIT_SUMMARY = 'VISIT_SUMMARY',
  INSURANCE = 'INSURANCE',
  OTHER = 'OTHER',
}

@Schema({ timestamps: true, collection: 'patient_documents' })
export class PatientDocumentFile {
  @Prop({ type: Types.ObjectId, ref: 'ClinicPatient', required: true, index: true })
  patientId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  doctorId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, enum: DocumentCategory, default: DocumentCategory.OTHER })
  category!: DocumentCategory;

  @Prop({ trim: true })
  description?: string;

  @Prop()
  documentDate?: Date;

  @Prop({ required: true })
  fileName!: string;

  @Prop({ required: true })
  mimeType!: string;

  @Prop({ required: true })
  sizeBytes!: number;

  /** Relative path under uploads/ — never a public URL */
  @Prop({ required: true })
  storageKey!: string;
}

export const PatientDocumentSchema = SchemaFactory.createForClass(PatientDocumentFile);
