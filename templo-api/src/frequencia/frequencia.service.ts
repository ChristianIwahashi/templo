import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFrequenciaDto } from './dto/create-frequencia.dto';
import { UpdateFrequenciaDto } from './dto/update-frequencia.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FrequenciaService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateFrequenciaDto, usuarioLogado?: any) {
    if (usuarioLogado && usuarioLogado.papel === 'PROFESSOR' && data.idProfessor !== usuarioLogado.idUsuario) {
      throw new ForbiddenException('Você só pode registrar frequência no seu próprio nome.');
    }

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

  async findAll(usuarioLogado?: any) {
    let filtro = {};

    if (usuarioLogado) {
      if (usuarioLogado.papel === 'ALUNO') {
        filtro = { idAluno: usuarioLogado.idUsuario };
      } else if (usuarioLogado.papel === 'PROFESSOR') {
        filtro = { idProfessor: usuarioLogado.idUsuario };
      }
    }
    
    return await this.prisma.frequencia.findMany({
      include: {
        aluno: { include: { usuario: { select: { nome: true } } } },
        professor: { include: { usuario: { select: { nome: true } } } }
      },
      orderBy: { dataAula: 'desc' }
    });
  }

  async getById(idFrequencia: number, usuarioLogado?: any) {
    const frequencia = await this.prisma.frequencia.findUnique({
      where: { idFrequencia },
      include: {
        aluno: { include: { usuario: { select: { nome: true } } } },
        professor: { include: { usuario: { select: { nome: true } } } }
      }
    });

    if (!frequencia) throw new NotFoundException('Registro de frequência não encontrado');

    if (usuarioLogado) {
      if (usuarioLogado.papel === 'ALUNO' && frequencia.idALuno !== usuarioLogado.idUsuario) {
        throw new ForbiddenException('Acesso negado: Este registro pertence a outro aluno.');
      }
      if (usuarioLogado.papel === 'PROFESSOR' && frequencia.idProfessor !== usuarioLogado.idUsuario) {
        throw new ForbiddenException('Acesso negado: Este chamado foi realizado por outro professor.');
      }
    }

    return frequencia;
  }

  async update(idFrequencia: number, data: UpdateFrequenciaDto, usuarioLogado?: any) {
    await this.getById(idFrequencia, usuarioLogado);

    return await this.prisma.frequencia.update({
      where: { idFrequencia },
      data: {
        dataAula: data.dataAula ? new Date(data.dataAula) : undefined,
        presenca: data.presenca,
      }
    });

  }

  async delete(idFrequencia: number, usuarioLogado?: any) {
    await this.getById(idFrequencia, usuarioLogado);
    return await this.prisma.frequencia.delete({ where: { idFrequencia } });
  }
}
