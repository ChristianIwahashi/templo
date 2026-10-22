import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  //Solicita o envio do e-mail com o token de recuperação
  @Post('esqueci-senha')
  async esqueciSenha(@Body() data: EsqueciSenhaDto) {
    return this.authService.esqueciSenha(data);
  }

  //Valida o token e troca a senha no banco
  @Post('redefinir-senha')
  async redefinirSenha(@Body() data: RedefinirSenhaDto) {
    return this.authService.redefinirSenha(data);
  }
}