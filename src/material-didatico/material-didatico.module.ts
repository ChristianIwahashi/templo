import { Module } from '@nestjs/common';
import { MaterialDidaticoService } from './material-didatico.service';
import { MaterialDidaticoController } from './material-didatico.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MaterialDidaticoController],
  providers: [MaterialDidaticoService],
})
export class MaterialDidaticoModule {}
