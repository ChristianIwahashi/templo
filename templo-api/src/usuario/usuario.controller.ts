import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioService } from './usuario.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuario')
export class UsuarioController {

    constructor (private readonly usuarioService: UsuarioService) {}

    @Roles('GESTOR')
    @Post()
    async create(@Body() data: CreateUsuarioDto) {
        return this.usuarioService.create(data);
    }

    @Roles('GESTOR')
    @Get()
    async findAll() {
        return this.usuarioService.findAll();
    }

    @Roles('GESTOR')
    @Put(":idUsuario")
    async update(
        @Param("idUsuario") idUsuario: number, 
        @Body() data:UpdateUsuarioDto) {
        return this.usuarioService.update(Number(idUsuario), data);
    }

    @Roles('GESTOR')
    @Delete(":idUsuario")
    async delete(@Param("idUsuario") idUsuario: number) {
        return this.usuarioService.delete(Number(idUsuario));
    }

    @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
    @Get(":idUsuario")
    async getById(
        @Param("idUsuario") idUsuario: number,
        @CurrentUser() usuarioLogado: any) {
        return this.usuarioService.getById(Number(idUsuario), usuarioLogado);
    }

    @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
    @Patch('meu-perfil')
    async updatePerfil(
        @CurrentUser() usuarioLogado: any,
        @Body() data: UpdateUsuarioDto
    ) {
        return this.usuarioService.updatePerfil(usuarioLogado.idUsuario, data);
    }
}
