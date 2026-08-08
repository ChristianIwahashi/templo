import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { AvisoEventoService } from './aviso-evento.service';
import { CreateAvisoEventoDto } from './dto/create-aviso-evento.dto';
import { UpdateAvisoEventoDto } from './dto/update-aviso-evento.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('aviso-evento')
export class AvisoEventoController {
  constructor(private readonly avisoEventoService: AvisoEventoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Post()
  async create(@Body() data: CreateAvisoEventoDto,
  @CurrentUser() usuarioLogado: any) {
    return this.avisoEventoService.create(data, usuarioLogado);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Put(":idAvisoEvento")
  async update(@Param("idAvisoEvento") idAvisoEvento: number, @Body() data: UpdateAvisoEventoDto,
  @CurrentUser() usuarioLogado: any) {
    return this.avisoEventoService.update(Number(idAvisoEvento), data, usuarioLogado);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Delete(":idAvisoEvento")
  async delete(@Param(":idAvisoEvento") idAvisoEvento: number,
  @CurrentUser() usuarioLogado: any) {
    return this.avisoEventoService.delete(Number(idAvisoEvento), usuarioLogado);
  }

  @Get()
  async findAll(@Query('ativo') ativo?: string) {
    const apenasAtivos = ativo === 'true';
    return this.avisoEventoService.findAll(apenasAtivos);
  }

  @Get(":idAvisoEvento")
  async getbyId(@Param("idAvisoEvento") idAvisoEvento: number) {
    return this.avisoEventoService.getById(Number(idAvisoEvento));
  }
}
