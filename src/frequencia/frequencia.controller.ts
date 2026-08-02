import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { FrequenciaService } from './frequencia.service';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';

@Controller('frequencia')
export class FrequenciaController {
  constructor(private readonly frequenciaService: FrequenciaService) {}

  @Post()
  async create(@Body() data: CreateFrequenciaDto) {
    return this.frequenciaService.create(data);
  }

  @Get()
  async findAll() {
    return this.frequenciaService.findAll();
  }

  @Get(":idFrequencia")
  async getById(@Param("idFrequencia") idFrequencia: number) {
    return this.frequenciaService.getById(Number(idFrequencia));
  }

  @Put(":idFrequencia")
  async update(@Param("idFrequencia") idFrequencia: number, @Body() data: UpdateFrequenciaDto) {
    return this.frequenciaService.update(Number(idFrequencia), data);
  }

  @Delete(":idFrequencia")
  remove(@Param("idFrequencia") idFrequencia: number) {
    return this.frequenciaService.delete(Number(idFrequencia));
  }
}
