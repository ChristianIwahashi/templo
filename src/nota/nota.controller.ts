import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { NotaService } from './nota.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('nota')
export class NotaController {
  constructor(private readonly notaService: NotaService) {}

  @Roles('GESTOR', 'PROFESSOR')
  @Post()
  async create(
    @Body() data: CreateNotaDto,
    @CurrentUser() usuarioLogado: any) {
    return this.notaService.create(data, usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
  @Get()
  async findAll(@CurrentUser() usuarioLogado: any) {
    return this.notaService.findAll(usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
  @Get(":idNota")
  async getById(
    @Param("idNota") idNota: number,
    @CurrentUser() usuarioLogado: any) {
    return this.notaService.getById(Number(idNota), usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR')
  @Put(":idNota")
  async update(
    @Param("idNota") idNota: number, 
    @Body() data: UpdateNotaDto,
    @CurrentUser() usuarioLogado: any) {
    return this.notaService.update(Number(idNota), data, usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR')
  @Delete(":idNota")
  async delete(
    @Param("idNota") idNota: number,
    @CurrentUser() usuarioLogado: any) {
    return this.notaService.delete(Number(idNota), usuarioLogado);
  }
}
