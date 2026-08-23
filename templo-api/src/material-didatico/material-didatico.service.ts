import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MaterialDidaticoService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateMaterialDidaticoDto,
    usuarioLogado?: any) {
    if (usuarioLogado && usuarioLogado.papel === 'PROFESSOR' && data.idProfessor !== usuarioLogado.idUsuario) {
      throw new ForbiddenException('Você só pode enviar materiais no seu próprio nome.');
    }

    const professorExists = await this.prisma.professor.findUnique({
      where: { idUsuario: data.idProfessor }
    });
    if (!professorExists) throw new NotFoundException('Professor não encontrado.');

    if (!data.idTurma && (!data.idAluno || data.idAluno.length === 0)) {
      throw new BadRequestException('O material deve ser vinculado a uma turma ou a pelo menos um aluno.');
    }

    return await this.prisma.materialDidatico.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        arquivoUrl: data.arquivoUrl,
        idProfessor: data.idProfessor,

        turmasVinculadas: data.idTurma ? {
          create: { idTurma: data.idTurma }
        } : undefined,

        alunosVinculados: data.idAluno ? {
          create: data.idAluno.map(id => ({ idAluno: id }))
        } : undefined
      }
    });
  }

  async findAll(usuarioLogado?: any) {
    let filtro: any = {};

    if (usuarioLogado && usuarioLogado.papel === 'PROFESSOR') {
      filtro = { idProfessor: usuarioLogado.idUsuario };
    }

    return await this.prisma.materialDidatico.findMany({
      where: filtro,
      include: {
        professor: { include: { usuario: { select: { nome: true } } } },
        turmasVinculadas: { include: { turma: true } },
        alunosVinculados: {
          include: {
            aluno: {
              include: {
                usuario: { select: { nome: true } }
              }
            }
          }
        }
      },
      orderBy: { idMaterial: 'desc' }
    });
  }

  async getById(idMaterial: number, usuarioLogado?: any) {
    const material = await this.prisma.materialDidatico.findUnique({
      where: { idMaterial },
      include: {
        professor: { include: { usuario: { select: { nome: true } } } },
        turmasVinculadas: { include: { turma: true } },
        alunosVinculados: { include: { aluno: { include: { usuario: { select: { nome: true } } } } } }
      }
    });

    if (!material) throw new NotFoundException('Material não encontrado');

    if (usuarioLogado) {
      if (usuarioLogado.papel === 'PROFESSOR' && material.idProfessor !== usuarioLogado.idUsuario) {
        throw new ForbiddenException('Acesso negado: Este material pertence a outro professor.')
      }

      if (usuarioLogado.papel === 'ALUNO') {
        const aluno = await this.prisma.aluno.findUnique({ where: { idUsuario: usuarioLogado.idUsuario } });

        const materialDaTurma = material.turmasVinculadas.some(t => t.idTurma === aluno?.idTurma);

        const materialExclusivo = material.alunosVinculados.some(a => a.idAluno === usuarioLogado.idUsuario);

        if (!materialDaTurma && !materialExclusivo) {
          throw new ForbiddenException('Acesso negado: Este material não foi disponibilizado para você.');
        }
      }
    }

    return material;
  }

  async findForAluno(idAluno: number) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { idUsuario: idAluno },
      select: { idTurma: true }
    });

    return await this.prisma.materialDidatico.findMany({
      where: {
        OR: [
          { turmasVinculadas: { some: { idTurma: aluno?.idTurma || -1 } } },
          { alunosVinculados: { some: { idAluno: idAluno } } }
        ]
      },
      include: { professor: { include: { usuario: { select: { nome: true } } } } },
      orderBy: { idMaterial: 'desc' }
    });
  }

  async update(idMaterial: number, data: UpdateMaterialDidaticoDto, usuarioLogado?: any) {
    await this.getById(idMaterial, usuarioLogado);

    return await this.prisma.materialDidatico.update({
      where: { idMaterial },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        arquivoUrl: data.arquivoUrl,
      }
    });
  }

  async delete(idMaterial: number, usuarioLogado?: any) {
    await this.getById(idMaterial, usuarioLogado);
    return await this.prisma.materialDidatico.delete({ where: { idMaterial } });
  }
}
