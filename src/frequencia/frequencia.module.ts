import { Module } from '@nestjs/common';
import { FrequenciaService } from './frequencia.service';
import { FrequenciaController } from './frequencia.controller';

@Module({
  controllers: [FrequenciaController],
  providers: [FrequenciaService],
})
export class FrequenciaModule {}
