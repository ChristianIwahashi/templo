import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { NotaService } from './nota.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';

@Controller('nota')
export class NotaController {
  constructor(private readonly notaService: NotaService) {}

  @Post()
  async create(@Body() data: CreateNotaDto) {
    return this.notaService.create(data);
  }

  @Get()
  async findAll() {
    return this.notaService.findAll();
  }

  @Get(":idNota")
  async getById(@Param("idNota") idNota: number) {
    return this.notaService.getById(Number(idNota));
  }

  @Put(":idNota")
  async update(@Param("idNota") idNota: number, @Body() data: UpdateNotaDto) {
    return this.notaService.update(Number(idNota), data);
  }

  @Delete(":idNota")
  async delete(@Param("idNota") idNota: number) {
    return this.notaService.delete(Number(idNota));
  }
}
