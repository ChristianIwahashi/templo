import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { FrequenciaService } from './frequencia.service';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('frequencia')
export class FrequenciaController {
  constructor(private readonly frequenciaService: FrequenciaService) {}

  @Roles('GESTOR', 'PROFESSOR')
  @Post()
  async create(
    @Body() data: CreateFrequenciaDto,
    @CurrentUser() usuarioLogado: any) {
    return this.frequenciaService.create(data, usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
  @Get()
  async findAll(@CurrentUser() usuarioLogado: any) {
    return this.frequenciaService.findAll(usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
  @Get(":idFrequencia")
  async getById(
    @Param("idFrequencia") idFrequencia: number,
    @CurrentUser() usuarioLogado: any) {
    return this.frequenciaService.getById(Number(idFrequencia), usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR')
  @Put(":idFrequencia")
  async update(
    @Param("idFrequencia") idFrequencia: number, 
    @Body() data: UpdateFrequenciaDto,
    @CurrentUser() usuarioLogado: any) {
    return this.frequenciaService.update(Number(idFrequencia), data, usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR')
  @Delete(":idFrequencia")
  async delete(
    @Param("idFrequencia") idFrequencia: number,
    @CurrentUser() usuarioLogado: any) {
    return this.frequenciaService.delete(Number(idFrequencia), usuarioLogado);
  }
}
