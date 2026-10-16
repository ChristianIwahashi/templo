import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Roles('GESTOR', 'PROFESSOR')
  @Post()
  @UseInterceptors(
    // Sem diskStorage! O arquivo fica na memória RAM temporariamente durante a requisição
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const extensoesPermitidas = /png|jpg|jpeg|webp|pdf|docx|doc|xlsx|xls|zip/;
        const extensao = extname(file.originalname).toLowerCase().replace('.', '');
        
        if (extensoesPermitidas.test(extensao)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Formato inválido. Apenas imagens, PDFs, documentos e planilhas são permitidos.',
            ),
            false,
          );
        }
      },
    }),
  )
  uploadArquivo(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.enviarParaNuvem(file);
  }
}