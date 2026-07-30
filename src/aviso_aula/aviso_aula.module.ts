import { Module } from '@nestjs/common';
import { AvisoAulaService } from './aviso_aula.service';
import { AvisoAulaController } from './aviso_aula.controller';

@Module({
  controllers: [AvisoAulaController],
  providers: [AvisoAulaService],
})
export class AvisoAulaModule {}
