import { Module } from '@nestjs/common';
import { MensalidadeService } from './mensalidade.service';
import { MensalidadeController } from './mensalidade.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MensalidadeService],
  controllers: [MensalidadeController],
})
export class MensalidadeModule {}
