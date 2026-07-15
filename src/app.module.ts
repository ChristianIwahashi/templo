import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioService } from './usuario/usuario.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, UsuarioService],
})
export class AppModule {}
