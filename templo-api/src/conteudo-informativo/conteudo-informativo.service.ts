import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateConteudoInformativoDto } from './dto/create-conteudo-informativo.dto';
import { UpdateConteudoInformativoDto } from './dto/update-conteudo-informativo.dto';

@Injectable()
export class ConteudoInformativoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateConteudoInformativoDto, usuarioLogado?: any) {
    const SECOES_UNICAS: Record<string, string> = {
      SOBRE: 'Sobre Nós',
      HISTORIA: 'História do Templo',
      AULAS: 'Aulas de Japonês',
    };

    if (SECOES_UNICAS[data.categoria]) {
      const registroExistente = await this.prisma.conteudoInformativo.findFirst({
        where: { categoria: data.categoria }
      });

      if (registroExistente) {
        throw new BadRequestException(
          `Já existe uma publicação cadastrada para a seção "${SECOES_UNICAS[data.categoria]}". Por favor, edite o registro existente em vez de criar um novo.`
        );
      }
    }

    const gestorExists = await this.prisma.gestor.findUnique({ 
      where: { idUsuario: data.idGestor } 
    });
    
    if (!gestorExists) {
      throw new NotFoundException('Gestor não encontrado.');
    }

    return await this.prisma.conteudoInformativo.create({
      data: {
        categoria: data.categoria,
        titulo: data.titulo,
        texto: data.texto,
        imagemUrl: data.imagemUrl || '',
        idGestor: data.idGestor
      }
    });
  }

  async findAll(categoria?: string) {
    return await this.prisma.conteudoInformativo.findMany({
      where: categoria ? { categoria: categoria.trim().toUpperCase() } : {},
      include: { gestor: { include: { usuario: { select: { nome: true } } } } },
      orderBy: { idConteudo: 'desc' }
    });
  }

  async getById(idConteudo: number) {
    const conteudo = await this.prisma.conteudoInformativo.findUnique({
      where: { idConteudo },
      include: { gestor: { include: { usuario: { select: { nome: true } } } } }
    });
    
    if (!conteudo) throw new NotFoundException('Conteúdo informativo não encontrado.');
    return conteudo;
  }

  async update(idConteudo: number, data: UpdateConteudoInformativoDto, usuarioLogado?: any) {
    await this.getById(idConteudo);

    return await this.prisma.conteudoInformativo.update({
      where: { idConteudo },
      data: {
        categoria: data.categoria ? data.categoria.trim().toUpperCase() : undefined,
        titulo: data.titulo,
        texto: data.texto,
        imagemUrl: data.imagemUrl,
      }
    });
  }

  async delete(idConteudo: number, usuarioLogado?: any) {
    await this.getById(idConteudo);
    return await this.prisma.conteudoInformativo.delete({ where: { idConteudo } });
  }
}