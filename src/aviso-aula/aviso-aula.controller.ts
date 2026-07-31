import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AvisoAulaService } from './aviso-aula.service';
import { CreateAvisoAulaDto } from './dto/create-aviso-aula.dto';
import { UpdateAvisoAulaDto } from './dto/update-aviso-aula.dto';

@Controller('aviso-aula')
export class AvisoAulaController {
  constructor(private readonly avisoAulaService: AvisoAulaService) {}

  @Post()
  async create(@Body() data: CreateAvisoAulaDto) {
    return this.avisoAulaService.create(data);
  }

  @Get()
  async findAll() {
    return this.avisoAulaService.findAll();
  }

  @Get(":idAvisoAula")
  async getbyId(@Param("idAvisoAula") idAvisoAula: number) {
    return this.avisoAulaService.getById(Number(idAvisoAula));
  }

  @Put(":idAvisoAula")
  async update(@Param("idAvisoAula") idAvisoAula: number, @Body() data: UpdateAvisoAulaDto) {
    return this.avisoAulaService.update(Number(idAvisoAula), data);
  }

  @Delete(":idAvisoAula")
  async delete(@Param(":idAvisoAula") idAvisoAula: number) {
    return this.avisoAulaService.delete(Number(idAvisoAula));
  }
}
