import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { TurmaModule } from './turma/turma.module';
import { MensalidadeModule } from './mensalidade/mensalidade.module';

@Module({
  imports: [UsuarioModule, TurmaModule, MensalidadeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
