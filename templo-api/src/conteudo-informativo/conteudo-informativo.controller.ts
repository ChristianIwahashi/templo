import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Patch } from '@nestjs/common';
import { ConteudoInformativoService } from './conteudo-informativo.service';
import { CreateConteudoInformativoDto } from './dto/create-conteudo-informativo.dto';
import { UpdateConteudoInformativoDto } from './dto/update-conteudo-informativo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('conteudo-informativo')
export class ConteudoInformativoController {
  constructor(private readonly conteudoInformativoService: ConteudoInformativoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Post()
  async create(@Body() data: CreateConteudoInformativoDto,
  @CurrentUser() usuarioLogado: any) {
    return this.conteudoInformativoService.create(data, usuarioLogado);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Put(':idConteudo')
  async update(@Param('idConteudo') idConteudo: number,
  @Body() data: UpdateConteudoInformativoDto,
  @CurrentUser() usuarioLogado: any) {
    return this.conteudoInformativoService.update(Number(idConteudo), data, usuarioLogado);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Patch(':idConteudo')
  async updatePatch(@Param('idConteudo') idConteudo: number, @Body() data: UpdateConteudoInformativoDto, @CurrentUser() usuarioLogado: any) {
    return this.conteudoInformativoService.update(Number(idConteudo), data, usuarioLogado);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Delete(':idConteudo')
  async delete(@Param('idConteudo') idConteudo: number,
  @CurrentUser() usuarioLogado: any) {
    return this.conteudoInformativoService.delete(Number(idConteudo), usuarioLogado);
  }

  @Get()
  async findAll(@Query('categoria') categoria?: string) {
    return this.conteudoInformativoService.findAll(categoria);
  }

  @Get(':idConteudo')
  async getById(@Param('idConteudo') idConteudo: number) {
    return this.conteudoInformativoService.getById(Number(idConteudo));
  }
}
