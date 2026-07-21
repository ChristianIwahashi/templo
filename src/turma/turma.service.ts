import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TurmaDto } from './dto/turma.dto';

@Injectable()
export class TurmaService {
    constructor(private prisma: PrismaService) {}

    async create(data: TurmaDto) {
        const professorExists = await this.prisma.professor.findUnique({
            where: { idUsuario: data.idProfessor }
        });

        if (!professorExists) {
            throw new NotFoundException('Professor não encontrado. Verifique o ID informado.');
        }

        return await this.prisma.turma.create({
            data: {
                idProfessor: data.idProfessor
            }
        });
    }

    async findAll() {
        return await this.prisma.turma.findMany({
            include: {
                professor: {
                    include: {
                        usuario: {
                            select: { nome: true, email: true }
                        }
                    }
                },
                alunos: {
                    include: {
                        usuario: {
                            select: { nome: true }
                        }
                    }
                },
            }
        });
    }

    async getById(idTurma: number) {
        const turma = await this.prisma.turma.findUnique({
            where: { idTurma },
            include: {
                professor: {
                    include: { usuario: { select: { nome: true } } }
                },
                alunos: {
                    include: { usuario: { select: { nome: true } } }
                }
            }
        });

        if (!turma) {
            throw new NotFoundException('Turma não encontrada');
        }

        return turma;
    }

    async update(idTurma: number, data: TurmaDto) {
        await this.getById(idTurma);

        const professorExists = await.prisma.professor.findUnique({
            where: { idUsuario: data.idProfessor }
        });

        if (!professorExists) {
            throw new NotFoundException('O novo Professor informado não foi encontrado.');
        }

        return await this.prisma.turma.update({
            where: { idTurma },
            data: {
                idProfessor: data.idProfessor
            }
        });
    }

    async delete(idTurma: number) {
        await this.getById(idTurma);

        return await this.prisma.turma.delete({
            where: { idTurma }
        });
    }
}
