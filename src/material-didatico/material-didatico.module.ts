import { Module } from '@nestjs/common';
import { MaterialDidaticoService } from './material-didatico.service';
import { MaterialDidaticoController } from './material-didatico.controller';

@Module({
  controllers: [MaterialDidaticoController],
  providers: [MaterialDidaticoService],
})
export class MaterialDidaticoModule {}
