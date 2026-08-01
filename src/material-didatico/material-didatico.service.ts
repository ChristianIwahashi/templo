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

    const turmaExists = await this.prisma.turma.findUnique({
      where: { idTurma: data.idTurma }
    });
    if (!turmaExists) throw new NotFoundException('Turma não encontrada.');

    if (turmaExists.idProfessor !== data.idProfessor) {
      throw new BadRequestException('Este professor não é o responsável por esta turma.');
    }

    return await this.prisma.materialDidatico.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        arquivoUrl: data.arquivoUrl,
        idProfessor: data.idProfessor,
        turma: {
          create: { idTurma: data.idTurma }
        }
      }
    });
  }

  findAll() {
    return `This action returns all materialDidatico`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materialDidatico`;
  }

  update(id: number, updateMaterialDidaticoDto: UpdateMaterialDidaticoDto) {
    return `This action updates a #${id} materialDidatico`;
  }

  remove(id: number) {
    return `This action removes a #${id} materialDidatico`;
  }
}
