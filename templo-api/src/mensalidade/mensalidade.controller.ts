import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { MensalidadeService } from './mensalidade.service';
import { CreateMensalidadeDto } from './dto/create-mensalidade.dto';
import { UpdateMensalidadeDto } from './dto/update-mensalidade.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('mensalidade')
export class MensalidadeController {
  constructor(private readonly mensalidadeService: MensalidadeService) {}

  @Roles('GESTOR')
  @Post()
   async create(@Body() data: CreateMensalidadeDto) {
    return this.mensalidadeService.create(data);
  }

  @Roles('GESTOR', 'ALUNO')
  @Get()
  async findAll(@CurrentUser() usuarioLogado: any) {
    return this.mensalidadeService.findAll(usuarioLogado);
  }

  @Roles('GESTOR', 'ALUNO')
  @Get(":idMensalidade")
  async getById(@Param("idMensalidade") idMensalidade: number, @CurrentUser() usuarioLogado: any) {
    return this.mensalidadeService.getById(Number(idMensalidade), usuarioLogado);
  }

  @Roles('GESTOR')
  @Put(":idMensalidade")
  async update(@Param("idMensalidade") idMensalidade: number, @Body() data: UpdateMensalidadeDto) {
    return this.mensalidadeService.update(Number(idMensalidade), data);
  }

  @Roles('GESTOR')
  @Delete(":idMensalidade")
  async delete(@Param("idMensalidade") idMensalidade: number) {
    return this.mensalidadeService.delete(Number(idMensalidade));
  }
}
