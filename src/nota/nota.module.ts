import { Module } from '@nestjs/common';
import { NotaService } from './nota.service';
import { NotaController } from './nota.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [NotaService, PrismaService],
  controllers: [NotaController]
})
export class NotaModule {}
