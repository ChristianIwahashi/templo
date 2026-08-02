import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { TurmaModule } from './turma/turma.module';
import { MensalidadeModule } from './mensalidade/mensalidade.module';
import { NotaModule } from './nota/nota.module';
import { FrequenciaModule } from './frequencia/frequencia.module';
import { AvisoAulaModule } from './aviso-aula/aviso-aula.module';
import { MaterialDidaticoModule } from './material-didatico/material-didatico.module';
import { AvisoEventoModule } from './aviso-evento/aviso-evento.module';
import { ConteudoInformativoModule } from './conteudo-informativo/conteudo-informativo.module';

@Module({
  imports: [UsuarioModule, TurmaModule, MensalidadeModule, NotaModule, FrequenciaModule, AvisoAulaModule, MaterialDidaticoModule, AvisoEventoModule, ConteudoInformativoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
