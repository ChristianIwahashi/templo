import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { MaterialDidaticoService } from './material-didatico.service';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('material-didatico')
export class MaterialDidaticoController {
  constructor(private readonly materialDidaticoService: MaterialDidaticoService) {}

  @Roles('GESTOR', 'PROFESSOR')
  @Post()
  async create(@Body() data: CreateMaterialDidaticoDto, 
  @CurrentUser() usuarioLogado: any) {
    return this.materialDidaticoService.create(data, usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
  @Get()
  async findAll(@CurrentUser() usuarioLogado: any) {
    return this.materialDidaticoService.findAll(usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
  @Get(":idMaterial")
  async getById(@Param("idMaterial") idMaterial: number,
  @CurrentUser() usuarioLogado: any) {
    return this.materialDidaticoService.getById(Number(idMaterial), usuarioLogado);
  }

  @Roles('ALUNO')
  @Get("meus-materiais")
  async findForAluno(@CurrentUser() usuarioLogado: any) {
    return this.materialDidaticoService.findForAluno(usuarioLogado.idUsuario);
  }

  @Roles('GESTOR', 'PROFESSOR')
  @Put(":idMaterial")
  async update(@Param("idMaterial") idMaterial: number, 
  @Body() data: UpdateMaterialDidaticoDto,
  @CurrentUser() usuarioLogado: any) {
    return this.materialDidaticoService.update(Number(idMaterial), data, usuarioLogado);
  }

  @Roles('GESTOR', 'PROFESSOR')
  @Delete(":idMaterial")
  async delete(@Param("idMaterial") idMaterial: number,
  @CurrentUser() usuarioLogado: any) {
    return this.materialDidaticoService.delete(Number(idMaterial), usuarioLogado);
  }
}
