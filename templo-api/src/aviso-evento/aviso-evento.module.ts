import { Module } from '@nestjs/common';
import { AvisoEventoService } from './aviso-evento.service';
import { AvisoEventoController } from './aviso-evento.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AvisoEventoController],
  providers: [AvisoEventoService],
})
export class AvisoEventoModule {}
