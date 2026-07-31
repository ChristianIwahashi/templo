import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvisoAulaDto } from './dto/create-aviso-aula.dto';
import { UpdateAvisoAulaDto } from './dto/update-aviso-aula.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AvisoAulaService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAvisoAulaDto) {
    const professorExists = await this.prisma.professor.findUnique({
      where: { idUsuario: data.idProfessor }
    });
    if (!professorExists) throw new NotFoundException('Professor não encontrado.');

    const turmaExists = await this.prisma.turma.findUnique({
      where: { idTurma: data.idTurma }
    });
    if (turmaExists.idProfessor !== data.idProfessor) {
      throw new BadRequestException('Este professor não é o responsável por esta turma.');
    }

    return await this.prisma.avisoAula.create({
      data: {
        titulo: data.titulo,
        imagemUrl: data.imagemUrl,
        idProfessor: data.idProfessor,
        idTurma: data.idTurma
      }
    });
  }

  async findAll() {
    return await this.prisma.avisoAula.findMany({
      include: {
        professor: { include: { usuario: { select: { nome: true } } } },
        turma: true
      },
      orderBy: { dataPostagem: 'desc' }
    });
  }

  async getById(idAvisoAula: number) {
    const aviso = await this.prisma.avisoAula.findUnique({
      where: { idAvisoAula },
      include: {
        professor: { include: { usuario: { select: { nome: true } } } },
        turma: true
      }
    });

    if(!aviso) throw new NotFoundException('Aviso não encontrado.');
    return aviso;
  }

  async update(idAvisoAula: number, data: UpdateAvisoAulaDto) {
    return await this.prisma.avisoAula.update({
      where: { idAvisoAula },
      data: {
        titulo: data.titulo,
        imagemUrl: data.imagemUrl,
      }
    });
  }

  async delete(idAvisoAula: number) {
    await this.getById(idAvisoAula);
    return await this.prisma.avisoAula.delete({ where: { idAvisoAula } });
  }
}
