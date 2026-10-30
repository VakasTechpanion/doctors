import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { Model, Types } from 'mongoose';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { UserRole } from '../users/schemas/user.schema';
import { CreatePatientDto, UpdatePatientDto } from './dto/create-patient.dto';
import {
  ClinicPatient,
  ClinicPatientDocument,
} from './schemas/clinic-patient.schema';
import {
  DocumentCategory,
  PatientDocumentFile,
  PatientDocumentRecord,
} from './schemas/patient-document.schema';

@Injectable()
export class PatientsService {
  private readonly uploadRoot = join(process.cwd(), 'uploads', 'patient-docs');

  constructor(
    @InjectModel(ClinicPatient.name)
    private readonly patientModel: Model<ClinicPatientDocument>,
    @InjectModel(PatientDocumentFile.name)
    private readonly documentModel: Model<PatientDocumentRecord>,
  ) {
    if (!existsSync(this.uploadRoot)) {
      mkdirSync(this.uploadRoot, { recursive: true });
    }
  }

  private assertDoctor(role: UserRole) {
    if (role !== UserRole.DOCTOR && role !== UserRole.CLINIC_OWNER) {
      throw new ForbiddenException('Only doctors can manage clinic patients');
    }
  }

  private async nextMrn(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.patientModel.countDocuments();
    return `MC-${year}-${String(count + 1).padStart(6, '0')}`;
  }

  private toPatientView(p: ClinicPatientDocument | Record<string, unknown>) {
    const doc = p as ClinicPatientDocument;
    return {
      id: String(doc._id),
      doctorId: String(doc.doctorId),
      mrn: doc.mrn,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      phone: doc.phone,
      dateOfBirth: doc.dateOfBirth ? new Date(doc.dateOfBirth).toISOString().slice(0, 10) : undefined,
      gender: doc.gender,
      bloodGroup: doc.bloodGroup,
      addressLine1: doc.addressLine1,
      city: doc.city,
      state: doc.state,
      pincode: doc.pincode,
      emergencyName: doc.emergencyName,
      emergencyPhone: doc.emergencyPhone,
      allergies: doc.allergies ?? [],
      chronicConditions: doc.chronicConditions ?? [],
      currentMedications: doc.currentMedications ?? [],
      clinicalNotes: doc.clinicalNotes,
      isActive: doc.isActive,
      createdAt: (doc as { createdAt?: Date }).createdAt,
      updatedAt: (doc as { updatedAt?: Date }).updatedAt,
    };
  }

  async create(doctorId: string, role: UserRole, dto: CreatePatientDto) {
    this.assertDoctor(role);
    const mrn = await this.nextMrn();
    const patient = await this.patientModel.create({
      doctorId: new Types.ObjectId(doctorId),
      mrn,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: dto.email?.trim().toLowerCase(),
      phone: dto.phone?.trim(),
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      gender: dto.gender,
      bloodGroup: dto.bloodGroup?.trim(),
      addressLine1: dto.addressLine1?.trim(),
      city: dto.city?.trim(),
      state: dto.state?.trim(),
      pincode: dto.pincode?.trim(),
      emergencyName: dto.emergencyName?.trim(),
      emergencyPhone: dto.emergencyPhone?.trim(),
      allergies: dto.allergies ?? [],
      chronicConditions: dto.chronicConditions ?? [],
      currentMedications: dto.currentMedications ?? [],
      clinicalNotes: dto.clinicalNotes?.trim(),
      isActive: true,
    });
    return this.toPatientView(patient);
  }

  async list(doctorId: string, role: UserRole, q?: string) {
    this.assertDoctor(role);
    const filter: Record<string, unknown> = {
      doctorId: new Types.ObjectId(doctorId),
      isActive: true,
    };
    if (q?.trim()) {
      const term = q.trim();
      filter.$or = [
        { firstName: new RegExp(term, 'i') },
        { lastName: new RegExp(term, 'i') },
        { phone: new RegExp(term, 'i') },
        { mrn: new RegExp(term, 'i') },
        { email: new RegExp(term, 'i') },
      ];
    }
    const rows = await this.patientModel.find(filter).sort({ updatedAt: -1 }).lean();
    return rows.map((r) => this.toPatientView(r as unknown as ClinicPatientDocument));
  }

  async getOne(doctorId: string, role: UserRole, patientId: string) {
    this.assertDoctor(role);
    const patient = await this.patientModel.findById(patientId);
    if (!patient || String(patient.doctorId) !== doctorId) {
      throw new NotFoundException('Patient not found');
    }
    const documents = await this.documentModel
      .find({ patientId: patient._id, doctorId: patient.doctorId })
      .sort({ createdAt: -1 })
      .lean();

    return {
      patient: this.toPatientView(patient),
      documents: documents.map((d) => {
        const row = d as typeof d & { createdAt?: Date };
        return {
          id: String(row._id),
          title: row.title,
          category: row.category,
          description: row.description,
          documentDate: row.documentDate
            ? new Date(row.documentDate).toISOString().slice(0, 10)
            : undefined,
          fileName: row.fileName,
          mimeType: row.mimeType,
          sizeBytes: row.sizeBytes,
          createdAt: row.createdAt,
        };
      }),
    };
  }

  async update(doctorId: string, role: UserRole, patientId: string, dto: UpdatePatientDto) {
    this.assertDoctor(role);
    const patient = await this.patientModel.findById(patientId);
    if (!patient || String(patient.doctorId) !== doctorId) {
      throw new NotFoundException('Patient not found');
    }

    Object.assign(patient, {
      firstName: dto.firstName?.trim() ?? patient.firstName,
      lastName: dto.lastName?.trim() ?? patient.lastName,
      email: dto.email?.trim().toLowerCase() ?? patient.email,
      phone: dto.phone?.trim() ?? patient.phone,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : patient.dateOfBirth,
      gender: dto.gender ?? patient.gender,
      bloodGroup: dto.bloodGroup?.trim() ?? patient.bloodGroup,
      addressLine1: dto.addressLine1?.trim() ?? patient.addressLine1,
      city: dto.city?.trim() ?? patient.city,
      state: dto.state?.trim() ?? patient.state,
      pincode: dto.pincode?.trim() ?? patient.pincode,
      emergencyName: dto.emergencyName?.trim() ?? patient.emergencyName,
      emergencyPhone: dto.emergencyPhone?.trim() ?? patient.emergencyPhone,
      allergies: dto.allergies ?? patient.allergies,
      chronicConditions: dto.chronicConditions ?? patient.chronicConditions,
      currentMedications: dto.currentMedications ?? patient.currentMedications,
      clinicalNotes: dto.clinicalNotes?.trim() ?? patient.clinicalNotes,
    });
    await patient.save();
    return this.toPatientView(patient);
  }

  async softDelete(doctorId: string, role: UserRole, patientId: string) {
    this.assertDoctor(role);
    const patient = await this.patientModel.findById(patientId);
    if (!patient || String(patient.doctorId) !== doctorId) {
      throw new NotFoundException('Patient not found');
    }
    patient.isActive = false;
    await patient.save();
    return { ok: true };
  }

  async addDocument(
    doctorId: string,
    role: UserRole,
    patientId: string,
    meta: {
      title: string;
      category: DocumentCategory;
      description?: string;
      documentDate?: string;
    },
    file: Express.Multer.File,
  ) {
    this.assertDoctor(role);
    const patient = await this.patientModel.findById(patientId);
    if (!patient || String(patient.doctorId) !== doctorId) {
      throw new NotFoundException('Patient not found');
    }

    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const relativeKey = join(doctorId, String(patient._id), safeName);
    const absDir = join(this.uploadRoot, doctorId, String(patient._id));
    mkdirSync(absDir, { recursive: true });
    const absPath = join(absDir, safeName);
    await pipeline(Readable.from(file.buffer), createWriteStream(absPath));

    const doc = await this.documentModel.create({
      patientId: patient._id,
      doctorId: patient.doctorId,
      title: meta.title.trim(),
      category: meta.category,
      description: meta.description?.trim(),
      documentDate: meta.documentDate ? new Date(meta.documentDate) : undefined,
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageKey: relativeKey.replace(/\\/g, '/'),
    });

    return {
      id: String(doc._id),
      title: doc.title,
      category: doc.category,
      fileName: doc.fileName,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes,
    };
  }

  async getDocumentFile(doctorId: string, role: UserRole, documentId: string) {
    this.assertDoctor(role);
    const doc = await this.documentModel.findById(documentId);
    if (!doc || String(doc.doctorId) !== doctorId) {
      throw new NotFoundException('Document not found');
    }
    const absPath = join(this.uploadRoot, doc.storageKey);
    if (!existsSync(absPath)) {
      throw new NotFoundException('File missing on server');
    }
    return {
      absPath,
      fileName: doc.fileName,
      mimeType: doc.mimeType,
    };
  }

  async deleteDocument(doctorId: string, role: UserRole, documentId: string) {
    this.assertDoctor(role);
    const doc = await this.documentModel.findById(documentId);
    if (!doc || String(doc.doctorId) !== doctorId) {
      throw new NotFoundException('Document not found');
    }
    const absPath = join(this.uploadRoot, doc.storageKey);
    if (existsSync(absPath)) {
      try {
        unlinkSync(absPath);
      } catch {
        /* ignore */
      }
    }
    await doc.deleteOne();
    return { ok: true };
  }
}
