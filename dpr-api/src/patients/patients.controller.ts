import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../users/schemas/user.schema';
import { CreatePatientDto, UpdatePatientDto } from './dto/create-patient.dto';
import { PatientsService } from './patients.service';
import { DocumentCategory } from './schemas/patient-document.schema';

type AuthRequest = Request & {
  user: { userId: string; email: string; role: UserRole };
};

@ApiTags('clinic-patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('doctors/me/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @ApiOperation({ summary: 'List clinic patients for logged-in doctor' })
  list(@Req() req: AuthRequest, @Query('q') q?: string) {
    return this.patientsService.list(req.user.userId, req.user.role, q);
  }

  @Post()
  @ApiOperation({ summary: 'Register a new clinic patient (MRN assigned)' })
  create(@Req() req: AuthRequest, @Body() dto: CreatePatientDto) {
    return this.patientsService.create(req.user.userId, req.user.role, dto);
  }

  @Get('documents/:documentId/download')
  @ApiOperation({ summary: 'Download patient document (authorized)' })
  async download(
    @Req() req: AuthRequest,
    @Param('documentId') documentId: string,
    @Res() res: Response,
  ) {
    const file = await this.patientsService.getDocumentFile(
      req.user.userId,
      req.user.role,
      documentId,
    );
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.fileName.replace(/"/g, '')}"`,
    );
    createReadStream(file.absPath).pipe(res);
  }

  @Delete('documents/:documentId')
  @ApiOperation({ summary: 'Delete patient document' })
  deleteDocument(@Req() req: AuthRequest, @Param('documentId') documentId: string) {
    return this.patientsService.deleteDocument(
      req.user.userId,
      req.user.role,
      documentId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Patient chart + documents' })
  getOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.patientsService.getOne(req.user.userId, req.user.role, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update patient demographics / clinical details' })
  update(@Req() req: AuthRequest, @Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.patientsService.update(req.user.userId, req.user.role, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete (archive) patient' })
  remove(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.patientsService.softDelete(req.user.userId, req.user.role, id);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Upload clinical document (PDF/image)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        category: { type: 'string', enum: Object.values(DocumentCategory) },
        description: { type: 'string' },
        documentDate: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['title', 'category', 'file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const ok =
          file.mimetype.startsWith('image/') ||
          file.mimetype === 'application/pdf' ||
          file.mimetype === 'application/msword' ||
          file.mimetype ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if (!ok) {
          return cb(new BadRequestException('Only PDF, Word, or image files allowed') as never, false);
        }
        cb(null, true);
      },
    }),
  )
  uploadDocument(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      title: string;
      category: DocumentCategory;
      description?: string;
      documentDate?: string;
    },
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.patientsService.addDocument(
      req.user.userId,
      req.user.role,
      id,
      body,
      file,
    );
  }
}
