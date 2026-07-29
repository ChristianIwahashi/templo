import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FrequenciaService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateFrequenciaDto) {
    const professorExists = await this.prisma.professor.findUnique({
      where: { idUsuario: data.idProfessor }
    });
    if (!professorExists) throw new NotFoundException('Professor não encontrado');

    const alunoExists = await this.prisma.aluno.findUnique({
      where: { idUsuario: data.idAluno }
    });
    if (!alunoExists) throw new NotFoundException('Aluno não encontrado');

    return await this.prisma.frequencia.create({
      data: {
        dataAula: new Date(data.dataAula),
        presenca: data.presenca,
        idProfessor: data.idProfessor,
        idAluno: data.idAluno
      }
    });
  }

  async findAll() {
    return await this.prisma.frequencia.findMany({
      include: {
        aluno: { include: { usuario: { select: { nome: true } } } },
        professor: { include: { usuario: { select: { nome: true } } } }
      },
      orderBy: { dataAula: 'desc' }
    });
  }

  async getById(idFrequencia: number) {
    const frequencia = await this.prisma.frequencia.findUnique({
      where: { idFrequencia },
      include: {
        aluno: { include: { usuario: { select: { nome: true } } } },
        professor: { include: { usuario: { select: { nome: true } } } }
      }
    });

    if (!frequencia) throw new NotFoundException('Registro de frequência não encontrado');
    return frequencia;
  }

  async update(idFrequencia: number, data: UpdateFrequenciaDto) {
    await this.getById(idFrequencia);

    return await this.prisma.frequencia.update({
      where: { idFrequencia },
      data: {
        dataAula: data.dataAula ? new Date(data.dataAula) : undefined,
        presenca: data.presenca,
      }
    });

  }

  async delete(idFrequencia: number) {
    await this.getById(idFrequencia);
    return await this.prisma.frequencia.delete({ where: { idFrequencia } });
  }
}
