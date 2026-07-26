import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';

@Injectable()
export class TurmaService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateTurmaDto) {
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

    async update(idTurma: number, data: UpdateTurmaDto) {
        await this.getById(idTurma);

        const professorExists = await this.prisma.professor.findUnique({
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

    async matricularAluno(idTurma: number, idAluno: number) {
        await this.getById(idTurma);

        const alunoExists = await this.prisma.aluno.findUnique({
            where: { idUsuario: idAluno },
            include: { usuario: true }
        });

        if (!alunoExists) {
            throw new NotFoundException('Aluno não encontrado. Verifique se o ID informado realmente pertence a um aluno.');
        }

        await this.prisma.aluno.update({
            where: { idUsuario: idAluno },
            data: { idTurma: idTurma }
        });

        return {
            message: `Aluno(a) ${alunoExists.usuario.nome} matriculado(a) com sucesso na turma ${idTurma}!`,
        };
    }
}
