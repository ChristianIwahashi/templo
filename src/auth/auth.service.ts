import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(data: LoginDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { email: data.email },
    });

    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    if (!usuario.ativo) {
      throw new UnauthorizedException('Este usuário está desativado.');
    }

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const payload = {
      sub: usuario.idUsuario,
      email: usuario.email,
      papel: usuario.papel
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        idUsuario: usuario.idUsuario,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel
      }
    };
  }
}
