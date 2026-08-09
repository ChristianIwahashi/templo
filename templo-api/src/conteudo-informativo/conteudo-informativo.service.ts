import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateConteudoInformativoDto } from './dto/create-conteudo-informativo.dto';
import { UpdateConteudoInformativoDto } from './dto/update-conteudo-informativo.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ConteudoInformativoService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateConteudoInformativoDto,
    usuarioLogado?: any) {
    if (usuarioLogado && data.idGestor !== usuarioLogado.idUsuario) {
      throw new ForbiddenException('Você só pode criar conteúdos no seu próprio nome.');
    }

    const gestorExists = await this.prisma.gestor.findUnique({
      where: { idUsuario: data.idGestor }
    });
    if (!gestorExists) throw new NotFoundException('Gestor não encontrado.');

    return await this.prisma.conteudoInformativo.create({
      data: {
        categoria: data.categoria,
        titulo: data.titulo,
        texto: data.texto,
        imagemUrl: data.imagemUrl,
        idGestor: data.idGestor,
      },
    });
  }

  async findAll(categoria?: string) {
    return await this.prisma.conteudoInformativo.findMany({
      where: categoria ? { categoria } : {},
      include: {
        gestor: { include: { usuario: { select: { nome: true } } } }
      },
      orderBy: { idConteudo: 'desc' }
    });
  }

  async getById(idConteudo: number) {
    const conteudo = await this.prisma.conteudoInformativo.findUnique({
      where: { idConteudo },
      include: {
        gestor: { include: { usuario: { select: { nome: true } } } }
      }
    });

    if (!conteudo) throw new NotFoundException('Conteúdo informativo não encontrado.');
    return conteudo;
  }

  async update(idConteudo: number,
    data: UpdateConteudoInformativoDto, usuarioLogado?: any) {
    await this.getById(idConteudo);

    return await this.prisma.conteudoInformativo.update({
      where: { idConteudo },
      data: {
        categoria: data.categoria,
        titulo: data.titulo,
        texto: data.texto,
        imagemUrl: data.imagemUrl,
      },
    });
  }

  async delete(idConteudo: number, usuarioLogado?: any) {
    await this.getById(idConteudo);
    return await this.prisma.conteudoInformativo.delete({ where: { idConteudo } });
  }
}
