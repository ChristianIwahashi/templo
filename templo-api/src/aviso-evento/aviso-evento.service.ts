import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAvisoEventoDto } from './dto/create-aviso-evento.dto';
import { UpdateAvisoEventoDto } from './dto/update-aviso-evento.dto';

@Injectable()
export class AvisoEventoService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAvisoEventoDto) {
    const gestorExists = await this.prisma.gestor.findUnique({ 
      where: { idUsuario: data.idGestor } 
    });
    
    if (!gestorExists) {
      throw new NotFoundException('Gestor não encontrado.');
    }

    return await this.prisma.avisoEvento.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        imagemUrl: data.imagemUrl || '',
        ativo: data.ativo ?? true,
        idGestor: data.idGestor
      }
    });
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
    const id = Number(idAvisoEvento);
    if (isNaN(id)) throw new BadRequestException('ID de evento inválido.');

    const aviso = await this.prisma.avisoEvento.findUnique({ 
      where: { idAvisoEvento: id },
      include: { 
        gestor: { include: { usuario: { select: { nome: true } } } }
      }
    });

    if (!aviso) throw new NotFoundException('Aviso de evento não encontrado.');
    return aviso;
  }

  async update(idAvisoEvento: number, data: UpdateAvisoEventoDto) {
    const id = Number(idAvisoEvento);
    await this.getById(id);

    return await this.prisma.avisoEvento.update({ 
      where: { idAvisoEvento: id }, 
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        imagemUrl: data.imagemUrl,
        ativo: data.ativo !== undefined ? data.ativo : undefined
      } 
    });
  }

  async delete(idAvisoEvento: number) {
    const id = Number(idAvisoEvento);
    await this.getById(id);
    
    return await this.prisma.avisoEvento.delete({ 
      where: { idAvisoEvento: id } 
    });
  }
}