import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {

    constructor (private readonly usuarioService: UsuarioService) {}

    @Post()
    async create(@Body() data: UsuarioDto) {
        return this.usuarioService.create(data);
    }

    @Get()
    async findAll() {
        return this.usuarioService.findAll();
    }

    @Put(":idUsuario")
    async update(@Param("idUsuario") idUsuario: number, @Body() data:UsuarioDto) {
        return this.usuarioService.update(Number(idUsuario), data);
    }

    @Delete(":idUsuario")
    async delete(@Param("idUsuario") idUsuario: number) {
        return this.usuarioService.delete(Number(idUsuario));
    }

    @Get(":idUsuario")
    async getById(@Param("idUsuario") idUsuario: number) {
        return this.usuarioService.getById(Number(idUsuario));
    }
}
