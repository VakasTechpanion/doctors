import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { ClinicPatient, ClinicPatientSchema } from './schemas/clinic-patient.schema';
import {
  PatientDocumentFile,
  PatientDocumentSchema,
} from './schemas/patient-document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClinicPatient.name, schema: ClinicPatientSchema },
      { name: PatientDocumentFile.name, schema: PatientDocumentSchema },
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
