import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MensalidadeService } from './mensalidade.service';
import { CreateMensalidadeDto } from './dto/create-mensalidade.dto';
import { UpdateMensalidadeDto } from './dto/update-mensalidade.dto';

@Controller('mensalidade')
export class MensalidadeController {
  constructor(private readonly mensalidadeService: MensalidadeService) {}

  @Post()
   async create(@Body() data: CreateMensalidadeDto) {
    return this.mensalidadeService.create(data);
  }

  @Get()
  async findAll() {
    return this.mensalidadeService.findAll();
  }

  @Get(":idMensalidade")
  async getById(@Param("idMensalidade") idMensalidade: number, @Body() data: UpdateMensalidadeDto) {
    return this.mensalidadeService.update(Number(idMensalidade), data);
  }

  @Put(":idMensalidade")
  async update(@Param("idMensalidade") idMensalidade: number, @Body() data: UpdateMensalidadeDto) {
    return this.mensalidadeService.update(Number(idMensalidade), data);
  }

  @Delete(":idMensalidade")
  async delete(@Param(":idMensalidade") idMensalidade: number) {
    return this.mensalidadeService.delete(Number(idMensalidade));
  }
}
