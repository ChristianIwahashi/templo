import { Body, Controller, Post } from '@nestjs/common';
import type { UsuarioDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {

    constructor (private readonly usuarioService: UsuarioService) {}

    @Post()
    async create(@Body() data: UsuarioDto) {
        return this.usuarioService.create(data);
    }
}
