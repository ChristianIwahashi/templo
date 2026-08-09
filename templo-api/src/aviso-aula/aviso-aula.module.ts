import { Module } from '@nestjs/common';
import { AvisoAulaService } from './aviso-aula.service';
import { AvisoAulaController } from './aviso-aula.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AvisoAulaService],
  controllers: [AvisoAulaController],
})
export class AvisoAulaModule {}
