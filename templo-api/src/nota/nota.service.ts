import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NotaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateNotaDto, usuarioLogado?: any) {
    if (usuarioLogado && usuarioLogado.papel === 'PROFESSOR' && data.idProfessor !== usuarioLogado.idUsuario) {
      throw new ForbiddenException('Você só pode lançar notas no seu próprio nome.');
    }

    const professorExists = await this.prisma.professor.findUnique({
      where: { idUsuario: data.idProfessor }
    });
    if(!professorExists) throw new NotFoundException('Professor não encontrado');

    const alunoExists = await this.prisma.aluno.findUnique({
      where: { idUsuario: data.idAluno }
    });
    if(!alunoExists) throw new NotFoundException('Aluno não encontrado');

    return await this.prisma.nota.create({
      data: {
        valor: data.valor,
        tipo: data.tipo,
        data: new Date(data.data),
        idProfessor: data.idProfessor,
        idAluno: data.idAluno
      }
    });
  }

  async findAll(usuarioLogado?: any) {
    let filtro = {};

    if (usuarioLogado) {
      if (usuarioLogado.papel === 'ALUNO') {
        filtro = { idALuno: usuarioLogado.idUsuario };
      } else if (usuarioLogado.papel === 'PROFESSOR') {
        filtro = { idProfessor: usuarioLogado.idUsuario};
      }
    }

    return await this.prisma.nota.findMany({
      where: filtro,
      include: {
        aluno: { include: { usuario: { select: { nome: true } } } },
        professor: { include: { usuario: { select: { nome: true } } } }
      },
      orderBy: { data: 'desc' }
    });
  }

  async getById(idNota: number, usuarioLogado?: any) {
    const nota = await this.prisma.nota.findUnique({
      where: { idNota },
      include: {
        aluno: { include: { usuario: { select: { nome: true } } } },
        professor: { include: { usuario: { select: { nome: true } } } }
      }
    });

    if (!nota) throw new NotFoundException('Nota não encontrada');

    if (usuarioLogado) {
            if (usuarioLogado.papel === 'PROFESSOR' && nota.idProfessor !== usuarioLogado.idUsuario) {
                throw new ForbiddenException('Acesso negado: Esta nota foi lançada por outro professor.');
            }

            if (usuarioLogado.papel === 'ALUNO' && nota.idAluno !== usuarioLogado.idUsuario) {
                throw new ForbiddenException('Acesso negado: Esta nota pertence a outro aluno.');
            }
        }
        
    return nota;
  }

  async update(idNota: number, data: UpdateNotaDto, usuarioLogado?: any) {
    await this.getById(idNota, usuarioLogado);

    return await this.prisma.nota.update({
      where: { idNota },
      data: {
        valor: data.valor,
        tipo: data.tipo,
        data: data.data ? new Date(data.data) : undefined,
      }
    });
  }

  async delete(idNota: number, usuarioLogado?: any) {
    await this.getById(idNota, usuarioLogado);
    return await this.prisma.nota.delete({ where: { idNota} });
  }
}
