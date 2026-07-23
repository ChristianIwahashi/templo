import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { MatricularAlunoDto } from './dto/matricular-aluno.dto';

@Controller('turma')
export class TurmaController {
    constructor(private readonly turmaService: TurmaService) {}

    @Post()
    async create(@Body() data: CreateTurmaDto) {
        return this.turmaService.create(data);
    }

    @Get()
    async findAll() {
        return this.turmaService.findAll();
    }

    @Get(":idTurma")
    async getById(@Param("idTurma") idTurma: number) {
        return this.turmaService.getById(Number(idTurma));
    }

    @Put(":idTurma")
    async update(@Param("idTurma") idTurma: number, @Body() data: UpdateTurmaDto) {
        return this.turmaService.update(Number(idTurma), data);
    }

    @Delete(":idTurma")
    async delete(@Param("idTurma") idTurma: number) {
        return this.turmaService.delete(Number(idTurma));
    }

    @Post(":idTurma/matricular")
    async matricularAluno(
        @Param("idTurma") idTurma: number,
        @Body() data: MatricularAlunoDto
    ) {
        return this.turmaService.matricularAluno(Number(idTurma), data.idAluno);
    }
}
