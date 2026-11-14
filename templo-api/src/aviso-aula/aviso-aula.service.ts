import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvisoAulaDto } from './dto/create-aviso-aula.dto';
import { UpdateAvisoAulaDto } from './dto/update-aviso-aula.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AvisoAulaService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateAvisoAulaDto, usuarioLogado?: any) {
    if (usuarioLogado && usuarioLogado.papel === 'PROFESSOR' && data.idProfessor !== usuarioLogado.idUsuario) {
      throw new ForbiddenException('Você só pode postar avisos no seu próprio nome.');
    }

    const professorExists = await this.prisma.professor.findUnique({
      where: { idUsuario: data.idProfessor }
    });
    if (!professorExists) throw new NotFoundException('Professor não encontrado.');

    if (!data.idsTurmas || data.idsTurmas.length === 0) {
      throw new BadRequestException('Selecione ao menos uma turma de destino.');
    }

    return await this.prisma.avisoAula.create({
      data: {
        titulo: data.titulo,
        imagemUrl: data.imagemUrl,
        idProfessor: data.idProfessor,
        turmasVinculadas: {
          create: data.idsTurmas.map(id => ({ idTurma: id }))
        },
        criadoPorId: usuarioLogado?.idUsuario || null,
      },
      include: {
        turmasVinculadas: { include: { turma: true } }
      }
    });
  }

  async findAll(usuarioLogado?: any) {
    let filtro: any = {};

    if (usuarioLogado) {
      if (usuarioLogado.papel === 'PROFESSOR') {
        filtro = { idProfessor: usuarioLogado.idUsuario };
      } else if (usuarioLogado.papel === 'ALUNO') {
        const aluno = await this.prisma.aluno.findUnique({ where: { idUsuario: usuarioLogado.idUsuario } });

        if (!aluno || !aluno.idTurma) {
          return [];
        }

        filtro = {
          turmasVinculadas: {
            some: { idTurma: aluno.idTurma }
          }
        };
      }
    }

    return await this.prisma.avisoAula.findMany({
      where: filtro,
      include: {
        professor: { include: { usuario: { select: { nome: true } } } },
        criadoPor: { select: { idUsuario: true, nome: true, papel: true } },
        atualizadoPor: { select: { idUsuario: true, nome: true, papel: true } },
        turma: true
      },
      orderBy: { dataPostagem: 'desc' }
    });
  }

  async getById(idAvisoAula: number, usuarioLogado?: any) {
    const aviso = await this.prisma.avisoAula.findUnique({
      where: { idAvisoAula },
      include: {
        professor: { include: { usuario: { select: { nome: true } } } },
        criadoPor: { select: { idUsuario: true, nome: true, papel: true } },
        atualizadoPor: { select: { idUsuario: true, nome: true, papel: true } },
        turmasVinculadas: { include: { turma: true } }
      }
    });

    if (!aviso) throw new NotFoundException('Aviso não encontrado.');

    if (usuarioLogado) {
      if (usuarioLogado.papel === 'PROFESSOR' && aviso.idProfessor !== usuarioLogado.idUsuario) {
        throw new ForbiddenException('Acesso negado: Este aviso foi postado por outro professor.');
      }

      if (usuarioLogado.papel === 'ALUNO') {
        const aluno = await this.prisma.aluno.findUnique({ where: { idUsuario: usuarioLogado.idUsuario } });

        const pertenceATurma = aviso.turmasVinculadas.some(t => t.idTurma === aluno?.idTurma);
        if (!pertenceATurma) {
          throw new ForbiddenException('Acesso negado: Este aviso pertence a outra turma.');
        }
      }
    }

    return aviso;
  }

  async update(idAvisoAula: number,
    data: UpdateAvisoAulaDto, usuarioLogado?: any) {
    await this.getById(idAvisoAula, usuarioLogado);

    return await this.prisma.avisoAula.update({
      where: { idAvisoAula },
      data: {
        titulo: data.titulo,
        imagemUrl: data.imagemUrl,
        atualizadoPorId: usuarioLogado?.idUsuario || null,
      }
    });
  }

  async delete(idAvisoAula: number, usuarioLogado?: any) {
    await this.getById(idAvisoAula, usuarioLogado);
    return await this.prisma.avisoAula.delete({ where: { idAvisoAula } });
  }
}
