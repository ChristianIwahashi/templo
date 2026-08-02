import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConteudoInformativoDto } from './dto/create-conteudo-informativo.dto';
import { UpdateConteudoInformativoDto } from './dto/update-conteudo-informativo.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ConteudoInformativoService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateConteudoInformativoDto) {
    const gestorExists = await this.prisma.gestor.findUnique({
      where: { idUsuario: data.idGestor }
    });
    if (!gestorExists) throw new NotFoundException('Gestor não encontrado.');

    return await this.prisma.conteudoInformativo.create({ data });
  }

  async findAll(categoria?: string) {
    return await this.prisma.conteudoInformativo.findMany({
      where: categoria ? { categoria } : {},
      include: {
        gestor: { include: { usuario: { select: { nome: true } } } }
      }
    });
  }

  async getById(idConteudo: number) {
    const conteudo = await this.prisma.conteudoInformativo.findUnique({
      where: { idConteudo },
      include: {
        gestor: { include: { usuario: { select: { nome: true } } } }
      }
    });

    if(!conteudo) throw new NotFoundException('Conteúdo informativo não encontrado.');
    return conteudo;
  }

  async update(idConteudo: number, data: UpdateConteudoInformativoDto) {
      await this.getById(idConteudo);
      return await this.prisma.conteudoInformativo.update({
        where: { idConteudo }, data });
    }

  async delete(idConteudo: number) {
    await this.getById(idConteudo);
    return await this.prisma.conteudoInformativo.delete({ where: { idConteudo } });
  }
}
