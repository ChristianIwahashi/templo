import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { PrismaService } from 'src/database/prisma.service';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private brevoClient: BrevoClient;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.brevoClient = new BrevoClient({
      apiKey: this.configService.get<string>('BREVO_API_KEY') || '',
    });
  }

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

  async esqueciSenha(data: EsqueciSenhaDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { email: data.email },
    });

    if (!usuario) {
      return { message: 'Se o e-mail estiver cadastrado, as instruções foram enviadas.' };
    }

    // Gera token aleatório
    const token = crypto.randomBytes(32).toString('hex');
    
    // Expiração em 15 minutos
    const expiracao = new Date();
    expiracao.setMinutes(expiracao.getMinutes() + 15);

    await this.prisma.usuario.update({
      where: { idUsuario: usuario.idUsuario },
      data: {
        tokenRecuperacao: token,
        expiracaoToken: expiracao,
      },
    });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const linkRecuperacao = `${frontendUrl}/redefinir-senha?token=${token}`;

    try {
      await this.brevoClient.transactionalEmails.sendTransacEmail({
        sender: {
          email: this.configService.get<string>('BREVO_SENDER_EMAIL') || 'no-reply@templo.com',
          name: this.configService.get<string>('BREVO_SENDER_NAME') || 'Templo Lins',
        },
        to: [{ email: usuario.email, name: usuario.nome }],
        subject: 'Recuperação de Senha - Portal Acadêmico',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #0060ba; text-align: center;">Recuperação de Senha</h2>
            <p>Olá, <strong>${usuario.nome}</strong>,</p>
            <p>Recebemos uma solicitação para redefinir a senha de acesso ao seu Portal Acadêmico.</p>
            <p>Para criar uma nova senha, clique no botão abaixo (este link expira em 15 minutos):</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${linkRecuperacao}" style="background-color: #0060ba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Redefinir Minha Senha
              </a>
            </div>
            <p style="font-size: 12px; color: #64748b; text-align: center;">Se você não solicitou esta alteração, pode ignorar este e-mail com segurança.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Erro ao disparar e-mail via Brevo:', error);
      throw new InternalServerErrorException('Não foi possível enviar o e-mail de recuperação no momento.');
    }

    return { message: 'Se o e-mail estiver cadastrado, as instruções foram enviadas.' };
  }

  async redefinirSenha(data: RedefinirSenhaDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        tokenRecuperacao: data.token,
        expiracaoToken: {
          gt: new Date(), // Garante que o token ainda não expirou
        },
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Token de recuperação inválido ou expirado.');
    }

    const saltRounds = 12;
    const senhaCriptografada = await bcrypt.hash(data.novaSenha, saltRounds);

    await this.prisma.usuario.update({
      where: { idUsuario: usuario.idUsuario },
      data: {
        senha: senhaCriptografada,
        tokenRecuperacao: null,
        expiracaoToken: null,
      },
    });
    return { message: 'Senha alterada com sucesso! Você já pode fazer login.' };
  }
}