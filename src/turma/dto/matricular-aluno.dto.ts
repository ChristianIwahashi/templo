import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class MatricularAlunoDto {
    @IsInt({ message: 'O ID do aluno deve ser um número inteiro.'})
    @IsNotEmpty({ message: 'O ID do aluno é obrigatório.' })
    @Type(() => Number)
    idAluno!: number;
}
