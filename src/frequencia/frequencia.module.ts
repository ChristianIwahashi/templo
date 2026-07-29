import { Module } from '@nestjs/common';
import { FrequenciaService } from './frequencia.service';
import { FrequenciaController } from './frequencia.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [FrequenciaService, PrismaService],
  controllers: [FrequenciaController],
})
export class FrequenciaModule {}
