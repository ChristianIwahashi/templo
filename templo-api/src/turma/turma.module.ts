import { Module } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { TurmaController } from './turma.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
    imports: [PrismaModule],
      providers: [TurmaService],
      controllers: [TurmaController],
})
export class TurmaModule {}
