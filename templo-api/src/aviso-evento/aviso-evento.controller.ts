import { Body, Controller, Delete, Get, Param, Post, Put, Patch, Query, UseGuards } from '@nestjs/common';
import { AvisoEventoService } from './aviso-evento.service';
import { CreateAvisoEventoDto } from './dto/create-aviso-evento.dto';
import { UpdateAvisoEventoDto } from './dto/update-aviso-evento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('aviso-evento')
export class AvisoEventoController {
  constructor(private readonly avisoEventoService: AvisoEventoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Post()
  async create(@Body() data: CreateAvisoEventoDto) {
    return this.avisoEventoService.create(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Put(':idAvisoEvento')
  async updatePut(
    @Param('idAvisoEvento') idAvisoEvento: string, 
    @Body() data: UpdateAvisoEventoDto
  ) {
    return this.avisoEventoService.update(Number(idAvisoEvento), data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Patch(':idAvisoEvento')
  async updatePatch(
    @Param('idAvisoEvento') idAvisoEvento: string, 
    @Body() data: UpdateAvisoEventoDto
  ) {
    return this.avisoEventoService.update(Number(idAvisoEvento), data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('GESTOR')
  @Delete(':idAvisoEvento')
  async delete(@Param('idAvisoEvento') idAvisoEvento: string) {
    return this.avisoEventoService.delete(Number(idAvisoEvento));
  }

  // --- ROTAS PÚBLICAS (SITE) ---

  @Get()
  async findAll(@Query('ativo') ativo?: string) {
    const apenasAtivos = ativo === 'true';
    return this.avisoEventoService.findAll(apenasAtivos);
  }

  @Get(':idAvisoEvento')
  async getById(@Param('idAvisoEvento') idAvisoEvento: string) {
    return this.avisoEventoService.getById(Number(idAvisoEvento));
  }
}