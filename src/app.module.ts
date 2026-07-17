import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioService } from './usuario/usuario.service';
import { UsuarioController } from './usuario/usuario.controller';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [UsuarioModule],
  controllers: [AppController, UsuarioController],
  providers: [AppService, UsuarioService],
})
export class AppModule {}
