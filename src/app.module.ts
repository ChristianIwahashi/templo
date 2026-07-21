import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { TurmaModule } from './turma/turma.module';

@Module({
  imports: [UsuarioModule, TurmaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
