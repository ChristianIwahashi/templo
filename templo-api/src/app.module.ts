import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TurmaModule } from './turma/turma.module';
import { MensalidadeModule } from './mensalidade/mensalidade.module';
import { NotaModule } from './nota/nota.module';
import { FrequenciaModule } from './frequencia/frequencia.module';
import { AvisoAulaModule } from './aviso-aula/aviso-aula.module';
import { MaterialDidaticoModule } from './material-didatico/material-didatico.module';
import { ConteudoInformativoModule } from './conteudo-informativo/conteudo-informativo.module';
import { AvisoEventoModule } from './aviso-evento/aviso-evento.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsuarioModule,
    TurmaModule,
    MensalidadeModule,
    NotaModule,
    FrequenciaModule,
    AvisoAulaModule,
    MaterialDidaticoModule,
    ConteudoInformativoModule,
    AvisoEventoModule,
    UploadModule,
  ],
})
export class AppModule {}