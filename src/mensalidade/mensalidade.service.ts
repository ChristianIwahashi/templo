import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMensalidadeDto } from './dto/create-mensalidade.dto';
import { UpdateMensalidadeDto } from './dto/update-mensalidade.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MensalidadeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMensalidadeDto) {
    const gestorExists = await this.prisma.gestor.findUnique({
      where: { idUsuario: data.idGestor }
    });
    if (!gestorExists) throw new NotFoundException('Gestor não encontrado.');

    const alunoExists = await this.prisma.aluno.findUnique({
      where: { idUsuario: data.idAluno }
    });
    if (!alunoExists) throw new NotFoundException('Aluno não encontrado.');

    return await this.prisma.mensalidade.create({
      data: {
        mes: data.mes,
        valor: data.valor,
        dataVencimento: new Date(data.dataVencimento),
        statusPagamento: data.statusPagamento,
        idGestor: data.idGestor,
        idAluno: data.idAluno
      }
    });
  }

  async findAll(usuarioLogado?: any) {
    const filtro = (usuarioLogado && usuarioLogado.papel === 'ALUNO') 
    ? { idAluno: usuarioLogado.idUsuario } : {};

    return await this.prisma.mensalidade.findMany({
      where: filtro,
      include: {
        aluno: { include: { usuario: { select: { nome: true } } } },
        gestor: { include: { usuario: { select: { nome: true } } } }
      }
    });
  }

  async getById(idMensalidade: number, usuarioLogado?: any) {
    const mensalidade = await this.prisma.mensalidade.findUnique({
      where: { idMensalidade },
      include: {
        aluno: { include: { usuario: { select: { nome: true, email: true } } } },
        gestor: { include: { usuario: { select: { nome: true } } } }
      }
    });

    if (!mensalidade) throw new NotFoundException('Mensalidade não encontrada');

    if (usuarioLogado && usuarioLogado.papel === 'ALUNO' && mensalidade.idAluno !== usuarioLogado.idUsuario) {
      throw new ForbiddenException('Você não tem permissão para ver esta mensalidade.')
    }

    return mensalidade;
  }

  async update(idMensalidade: number, data: UpdateMensalidadeDto) {
    await this.getById(idMensalidade);
    
    return await this.prisma.mensalidade.update({
      where: { idMensalidade },
      data: {
        mes: data.mes,
        valor: data.valor,
        dataVencimento: data.dataVencimento ? new Date(data.dataVencimento) : undefined,
        statusPagamento: data.statusPagamento,
      }
    });
  }

  async delete(idMensalidade: number) {
    await this.getById(idMensalidade);
    return await this.prisma.mensalidade.delete({ where: { idMensalidade}});
  }
}
