import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvisoEventoDto } from './dto/create-aviso-evento.dto';
import { UpdateAvisoEventoDto } from './dto/update-aviso-evento.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AvisoEventoService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateAvisoEventoDto) {
    const gestorExists = await this.prisma.gestor.findUnique({
      where: { idUsuario: data.idGestor }
    });
    if (!gestorExists) throw new NotFoundException('Gestor não encontrado.');

    return await this.prisma.avisoEvento.create({ data });
  }

  async findAll(apenasAtivos: boolean = false) {
    return await this.prisma.avisoEvento.findMany({
      where: apenasAtivos ? { ativo: true } : {},
      include: {
        gestor: { include: { usuario: { select: { nome: true } } } }
      },
      orderBy: { dataPostagem: 'desc' }
    });
  }

  async getById(idAvisoEvento: number) {
    const aviso = await this.prisma.avisoEvento.findUnique({
      where: { idAvisoEvento }
    });

    if(!aviso) throw new NotFoundException('Aviso não encontrado.');
    return aviso;
  }

  async update(idAvisoEvento: number, data: UpdateAvisoEventoDto) {
    await this.getById(idAvisoEvento);
    return await this.prisma.avisoEvento.update({
      where: { idAvisoEvento }, data });
  }

  async delete(idAvisoEvento: number) {
    await this.getById(idAvisoEvento);
    return await this.prisma.avisoEvento.delete({ where: { idAvisoEvento } });
  }
}
