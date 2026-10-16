import 'multer';
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor(private configService: ConfigService) {
    // Configura o cliente S3 apontando para o Cloudflare R2
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.configService.get<string>('R2_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY') || '',
      },
    });

    this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || '';
    this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL') || '';
  }

  async enviarParaNuvem(file: Express.Multer.File): Promise<{ url: string; nomeOriginal: string; tamanho: number }> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    // 1. Gera um nome único para o arquivo
    const extensao = extname(file.originalname).toLowerCase();
    const chaveArquivo = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`;

    try {
      // 2. Dispara o arquivo da memória RAM direto para o bucket do R2
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: chaveArquivo,
          Body: file.buffer, // Arquivo na memória (sem salvar no disco local!)
          ContentType: file.mimetype, // Mantém o tipo correto (image/png, application/pdf)
        }),
      );

      // 3. Monta a URL pública definitiva
      const urlFinal = `${this.publicUrl}/${chaveArquivo}`;

      return {
        url: urlFinal,
        nomeOriginal: file.originalname,
        tamanho: file.size,
      };
    } catch (error) {
      console.error('Erro ao enviar arquivo para o Cloudflare R2:', error);
      throw new InternalServerErrorException('Falha no upload para o servidor de armazenamento.');
    }
  }
}