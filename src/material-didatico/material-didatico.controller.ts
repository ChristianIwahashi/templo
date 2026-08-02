import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MaterialDidaticoService } from './material-didatico.service';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';

@Controller('material-didatico')
export class MaterialDidaticoController {
  constructor(private readonly materialDidaticoService: MaterialDidaticoService) {}

  @Post()
  async create(@Body() data: CreateMaterialDidaticoDto) {
    return this.materialDidaticoService.create(data);
  }

  @Get()
  async findAll() {
    return this.materialDidaticoService.findAll();
  }

  @Get(":idMaterial")
  async getById(@Param("idMaterial") idMaterial: number) {
    return this.materialDidaticoService.getById(Number(idMaterial));
  }

  @Get("meus-materiais/:idAluno")
  async findForAluno(@Param("idAluno") idAluno: number) {
    return this.materialDidaticoService.findForAluno(Number(idAluno));
  }

  @Put(":idMaterial")
  async update(@Param("idMaterial") idMaterial: number, @Body() data: UpdateMaterialDidaticoDto) {
    return this.materialDidaticoService.update(Number(idMaterial), data);
  }

  @Delete(":idMaterial")
  async delete(@Param("idMaterial") idMaterial: number) {
    return this.materialDidaticoService.delete(Number(idMaterial));
  }
}
