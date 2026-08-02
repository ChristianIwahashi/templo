import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaterialDidaticoDto } from './dto/create-material-didatico.dto';
import { UpdateMaterialDidaticoDto } from './dto/update-material-didatico.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class MaterialDidaticoService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateMaterialDidaticoDto) {
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

  async findAll() {
    return await this.prisma.materialDidatico.findMany({
      include: {
        professor: { include: { usuario: { select: { nome: true } } } },
        turmasVinculadas: { include: { turma: true } }
      }
    });
  }

  async getById(idMaterial: number) {
    const material = await this.prisma.materialDidatico.findUnique({
      where: { idMaterial },
      include: {
        professor: { include: { usuario: { select: { nome: true} } } },
        turmasVinculadas: { include: { turma: true } },
        alunosVinculados: { include: { aluno: { include: { usuario: { select: { nome: true } } } } } }
      }
    });

    if (!material) throw new NotFoundException('Material não encontrado');
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
      include: { professor: { include: { usuario: { select: { nome: true } } } } }
    });
  }

  async update(idMaterial: number, data: UpdateMaterialDidaticoDto) {
    await this.getById(idMaterial);
    
    return await this.prisma.materialDidatico.update({
      where: { idMaterial },
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        arquivoUrl: data.arquivoUrl,
      }
    });
  }

  async delete(idMaterial: number) {
    await this.getById(idMaterial);
    return await this.prisma.materialDidatico.delete({ where: { idMaterial}});
  }
}
