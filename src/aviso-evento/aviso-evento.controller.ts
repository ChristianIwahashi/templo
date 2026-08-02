import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { AvisoEventoService } from './aviso-evento.service';
import { CreateAvisoEventoDto } from './dto/create-aviso-evento.dto';
import { UpdateAvisoEventoDto } from './dto/update-aviso-evento.dto';

@Controller('aviso-evento')
export class AvisoEventoController {
  constructor(private readonly avisoEventoService: AvisoEventoService) {}

  @Post()
  async create(@Body() data: CreateAvisoEventoDto) {
    return this.avisoEventoService.create(data);
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

  @Put(":idAvisoEvento")
  async update(@Param("idAvisoEvento") idAvisoEvento: number, @Body() data: UpdateAvisoEventoDto) {
    return this.avisoEventoService.update(Number(idAvisoEvento), data);
  }

  @Delete(":idAvisoEvento")
  async delete(@Param(":idAvisoEvento") idAvisoEvento: number) {
    return this.avisoEventoService.delete(Number(idAvisoEvento));
  }
}
