import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { AvisoAulaService } from './aviso-aula.service';
import { CreateAvisoAulaDto } from './dto/create-aviso-aula.dto';
import { UpdateAvisoAulaDto } from './dto/update-aviso-aula.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('aviso-aula')
export class AvisoAulaController {
  constructor(private readonly avisoAulaService: AvisoAulaService) {}

  @Roles('GESTOR', 'PROFESSOR')
  @Post()
  async create(@Body() data: CreateAvisoAulaDto,
  @CurrentUser() usuarioLogado: any) {
    return this.avisoAulaService.create(data, usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
  @Get()
  async findAll(@CurrentUser() usuarioLogado: any) {
    return this.avisoAulaService.findAll(usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
  @Get(":idAvisoAula")
  async getbyId(@Param("idAvisoAula") idAvisoAula: number,
  @CurrentUser() usuarioLogado: any) {
    return this.avisoAulaService.getById(Number(idAvisoAula), usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR')
  @Put(":idAvisoAula")
  async update(@Param("idAvisoAula") idAvisoAula: number,
  @Body() data: UpdateAvisoAulaDto,
  @CurrentUser() usuarioLogado: any) {
    return this.avisoAulaService.update(Number(idAvisoAula), data, usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR')
  @Delete(":idAvisoAula")
  async delete(@Param("idAvisoAula") idAvisoAula: number,
  @CurrentUser() usuarioLogado: any) {
    return this.avisoAulaService.delete(Number(idAvisoAula), usuarioLogado);
  }
}
