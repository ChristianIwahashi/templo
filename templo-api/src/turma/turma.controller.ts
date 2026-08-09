import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { MatricularAlunoDto } from './dto/matricular-aluno.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('turma')
export class TurmaController {
    constructor(private readonly turmaService: TurmaService) {}

    @Roles('GESTOR')
    @Post()
    async create(@Body() data: CreateTurmaDto) {
        return this.turmaService.create(data);
    }

    @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
    @Get()
    async findAll(@CurrentUser() usuarioLogado: any) {
        return this.turmaService.findAll(usuarioLogado);
    }

    @Roles('GESTOR', 'PROFESSOR', 'ALUNO')
    @Get(":idTurma")
    async getById(
        @Param("idTurma") idTurma: number,
        @CurrentUser() usuarioLogado: any) {
        return this.turmaService.getById(Number(idTurma), usuarioLogado);
    }

    @Roles('GESTOR')
    @Put(":idTurma")
    async update(@Param("idTurma") idTurma: number, @Body() data: UpdateTurmaDto) {
        return this.turmaService.update(Number(idTurma), data);
    }

    @Roles('GESTOR')
    @Delete(":idTurma")
    async delete(@Param("idTurma") idTurma: number) {
        return this.turmaService.delete(Number(idTurma));
    }

    @Roles('GESTOR')
    @Post(":idTurma/matricular")
    async matricularAluno(
        @Param("idTurma") idTurma: number,
        @Body() data: MatricularAlunoDto
    ) {
        return this.turmaService.matricularAluno(Number(idTurma), data.idAluno);
    }
}
