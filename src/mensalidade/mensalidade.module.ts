import { Module } from '@nestjs/common';
import { MensalidadeService } from './mensalidade.service';
import { MensalidadeController } from './mensalidade.controller';

@Module({
  controllers: [MensalidadeController],
  providers: [MensalidadeService],
})
export class MensalidadeModule {}
