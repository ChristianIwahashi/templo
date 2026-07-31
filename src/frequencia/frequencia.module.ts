import { Module } from '@nestjs/common';
import { FrequenciaService } from './frequencia.service';
import { FrequenciaController } from './frequencia.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [FrequenciaService],
  controllers: [FrequenciaController],
})
export class FrequenciaModule {}
