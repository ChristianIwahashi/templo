import { Module } from '@nestjs/common';
import { ConteudoInformativoService } from './conteudo-informativo.service';
import { ConteudoInformativoController } from './conteudo-informativo.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConteudoInformativoController],
  providers: [ConteudoInformativoService],
})
export class ConteudoInformativoModule {}
