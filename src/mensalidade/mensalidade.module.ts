import { Module } from '@nestjs/common';
import { MensalidadeService } from './mensalidade.service';
import { MensalidadeController } from './mensalidade.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  providers: [MensalidadeService, PrismaService],
  controllers: [MensalidadeController]
})
export class MensalidadeModule {}
