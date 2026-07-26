import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NotaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateNotaDto) {
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

  async findAll() {
    return await this.prisma.nota.findMany({
      include: {
        aluno: { include: { usuario: { select: { nome: true } } } },
        professor: { include: { usuario: { select: { nome: true } } } }
      }
    });
  }

  async getById(idNota: number) {
    const nota = await this.prisma.nota.findUnique({
      where: { idNota },
      include: {
        aluno: { include: { usuario: { select: { nome: true } } } },
        professor: { include: { usuario: { select: { nome: true } } } }
      }
    });

    if (!nota) throw new NotFoundException('Nota não encontrada');
    return nota;
  }

  async update(idNota: number, data: UpdateNotaDto) {
    await this.getById(idNota);

    return await this.prisma.nota.update({
      where: { idNota },
      data: {
        valor: data.valor,
        tipo: data.tipo,
        data: data.data ? new Date(data.data) : undefined,
      }
    });
  }

  async delete(idNota: number) {
    await this.getById(idNota);
    return await this.prisma.nota.delete({ where: { idNota} });
  }
}
