import { Module } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { TurmaController } from './turma.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
    imports:[PrismaModule],
    controllers: [TurmaController],
    providers: [TurmaService],
})
export class TurmaModule {}
