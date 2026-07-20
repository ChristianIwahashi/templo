import { Injectable, NotFoundException } from '@nestjs/common';
import { UsuarioDto } from './dto/usuario.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsuarioService {

    constructor(private prisma: PrismaService) { }
    async create(data: UsuarioDto) {
        return this.prisma.$transaction(async (tx) => {
            const usuario = await tx.usuario.create({
                data: {
                    nome: data.nome,
                    email: data.email,
                    senha: data.senha,
                    telefone: data.telefone,
                    ativo: data.ativo,
                    papel: data.papel,
                }
            });

            if (data.papel === 'ALUNO') {
                await tx.aluno.create({
                    data: {
                        idUsuario: usuario.idUsuario,
                        dataNascimento: new Date(),
                        idGestor: 1, //Mudar Posteriormente
                    },
                });
            } else if (data.papel === 'PROFESSOR') {
                await tx.professor.create({
                    data: {
                        idUsuario: usuario.idUsuario,
                        idGestor: 1, //Mudar Posteriormente
                    },
                });
            } else if (data.papel === 'GESTOR') {
                await tx.gestor.create({
                    data: {
                        idUsuario: usuario.idUsuario,
                    },
                });
            }
            return usuario;
        });
    }

    async findAll() {
        return await this.prisma.usuario.findMany({
            include: {
                aluno: true,
                professor: true,
                gestor: true,
            },
        });
    }

    async update(idUsuario: number, data: UsuarioDto) {
        const usuarioExists = await this.prisma.usuario.findUnique({
            where: {
                idUsuario,
            }
        });

        if (!usuarioExists) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return await this.prisma.usuario.update({
            data: {
                nome: data.nome,
                email: data.email,
                senha: data.senha,
                telefone: data.telefone,
                ativo: data.ativo,
            },
            where: {
                idUsuario
            },
        });
    }

    async delete(idUsuario: number) {
        const usuarioExists = await this.prisma.usuario.findUnique({
            where: {
                idUsuario
            },
        });

        if (!usuarioExists) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return await this.prisma.usuario.delete({
            where: {
                idUsuario
            },
        });
    }

    async getById(idUsuario: number) {
        const usuarioExists = await this.prisma.usuario.findUnique({
            where: {
                idUsuario
            },
            include: {
                aluno: true,
                professor: true,
                gestor: true,
            }
        });

        if (!usuarioExists) {
            throw new NotFoundException('Usuário não encontrado');
        }

        return usuarioExists;
    }
} 
