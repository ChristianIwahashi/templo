import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ConteudoInformativoService } from './conteudo-informativo.service';
import { CreateConteudoInformativoDto } from './dto/create-conteudo-informativo.dto';
import { UpdateConteudoInformativoDto } from './dto/update-conteudo-informativo.dto';

@Controller('conteudo-informativo')
export class ConteudoInformativoController {
  constructor(private readonly conteudoInformativoService: ConteudoInformativoService) {}

  @Post()
  async create(@Body() data: CreateConteudoInformativoDto) {
    return this.conteudoInformativoService.create(data);
  }

  @Get()
  async findAll(@Query('categoria') categoria?: string) {
    return this.conteudoInformativoService.findAll(categoria);
  }

  @Get(':idConteudo')
  async getById(@Param('idConteudo') idConteudo: number) {
    return this.conteudoInformativoService.getById(Number(idConteudo));
  }

  @Put(':idConteudo')
  async update(@Param('idConteudo') idConteudo: number, @Body() data: UpdateConteudoInformativoDto) {
    return this.conteudoInformativoService.update(Number(idConteudo), data);
  }

  @Delete(':idConteudo')
  async delete(@Param('idConteudo') idConteudo: number) {
    return this.conteudoInformativoService.delete(Number(idConteudo));
  }
}
