import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdatePerfilDto } from './dto/update-perfil.dto';

@Injectable()
export class UsuarioService {

    constructor(private prisma: PrismaService) { }

    async create(data: CreateUsuarioDto) {
        const emailExist = await this.prisma.usuario.findFirst({
            where: { email: data.email }
        })

        if (emailExist) {
            throw new BadRequestException('Este e-mail já está em uso.');
        }

        const saltRounds = 12;
        const senhaCriptografada = await bcrypt.hash(data.senha, saltRounds);

        const usuario = await this.prisma.$transaction(async (tx) => {
            const NovoUsuario = await tx.usuario.create({
                data: {
                    nome: data.nome,
                    email: data.email,
                    senha: senhaCriptografada,
                    telefone: data.telefone,
                    ativo: data.ativo,
                    papel: data.papel,
                }
            });

            if (data.papel === 'ALUNO') {
                await tx.aluno.create({
                    data: {
                        idUsuario: NovoUsuario.idUsuario,
                        dataNascimento: new Date(data.dataNascimento),
                        idGestor: data.idGestor,
                    },
                });
            } else if (data.papel === 'PROFESSOR') {
                await tx.professor.create({
                    data: {
                        idUsuario: NovoUsuario.idUsuario,
                        idGestor: data.idGestor,
                    },
                });
            } else if (data.papel === 'GESTOR') {
                await tx.gestor.create({
                    data: {
                        idUsuario: NovoUsuario.idUsuario,
                    },
                });
            }
            return NovoUsuario;
        });

        const { senha, ...usuarioSemSenha } = usuario as any;
        return usuarioSemSenha;
    }

    async findAll() {
        const usuarios = await this.prisma.usuario.findMany({
            include: {
                aluno: true,
                professor: true,
                gestor: true,
            },
        });

        return usuarios.map((usuario) => {
            const { senha, ...resto } = usuario as any;
            return resto;
        });
    }

    async update(idUsuario: number, data: UpdateUsuarioDto) {
        const usuarioExists = await this.prisma.usuario.findUnique({
            where: {
                idUsuario,
            }
        });

        if (!usuarioExists) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const usuarioAtualizado = await this.prisma.usuario.update({
            where: {
                idUsuario
            },
            data: {
                nome: data.nome,
                email: data.email,
                telefone: data.telefone,
                ativo: data.ativo,
            },
        });

        const { senha, ...usuarioSemSenha } = usuarioAtualizado;
        return usuarioSemSenha;
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

        const usuarioDeletado = await this.prisma.usuario.delete({
            where: {
                idUsuario
            },
        });

        const { senha, ...usuarioSemSenha } = usuarioDeletado;
        return usuarioSemSenha;
    }

    async getById(idUsuario: number, usuarioLogado?: any) {
        if (usuarioLogado && usuarioLogado.papel !== 'GESTOR' && usuarioLogado.idUsuario !== idUsuario) {
            throw new ForbiddenException('Acesso negado: Você só pode visualizar o seu próprio perfil.');
        }

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

         const { senha, ...usuarioSemSenha } = usuarioExists;
        return usuarioSemSenha;
    }

    async updatePerfil(idUsuario: number, data: UpdatePerfilDto) {
        const usuarioExists = await this.prisma.usuario.findUnique({
            where: { idUsuario }
        });

        if (!usuarioExists) throw new NotFoundException('Usuário não encontrado');

        const senhaValida = await bcrypt.compare(data.senhaAntiga, usuarioExists.senha);
        if (!senhaValida) {
            throw new BadRequestException('A senha atual informada está incorreta.');
        }

        const dadosParaAtualizar: any = {};

        if (data.telefone) {
            dadosParaAtualizar.telefone = data.telefone;
        }

        if (data.senha) {
            const saltRounds = 12;
            dadosParaAtualizar.senha = await bcrypt.hash(data.senha, saltRounds);
        }

        if (Object.keys(dadosParaAtualizar).length === 0) {
            throw new BadRequestException('Nenhum dado válido para atualizar.');
        }

        const usuarioAtualizado = await this.prisma.usuario.update({
            where: { idUsuario },
            data: dadosParaAtualizar
        });

        const { senha, ...usuarioSemSenha } = usuarioAtualizado as any;
        return usuarioSemSenha;
    }
} 
