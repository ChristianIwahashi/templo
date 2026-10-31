import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTurmaDto {
    @IsString({ message: 'O nome da turma deve ser um texto.' })
    @IsNotEmpty({ message: 'O nome da turma é obrigatório.' })
    @MaxLength(100, { message: 'O nome da turma deve ter no máximo 100 caracteres.' })
    nome!: string;

    @IsInt({ message: 'O ID do professor deve ser um número inteiro.'})
    @IsNotEmpty({ message: 'O ID do professor é obrigatório.' })
    @Type(() => Number)
    idProfessor!: number;
}
