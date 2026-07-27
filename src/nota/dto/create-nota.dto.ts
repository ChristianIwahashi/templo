import { Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateNotaDto {
    @IsNumber({}, { message: 'O valor da nota deve ser um número.' })
    @Min(0, { message: 'A nota mínima é 0.' })
    @Max(10, { message: 'A nota máxima é 10.' })
    @Type(() => Number)
    @IsNotEmpty()
    valor!: number;

    @IsString()
    @IsNotEmpty({ message: 'O tipo de avaliação é obrigatório (Ex: PROVA, ATIVIDADE).' })
    tipo!: string;

    @IsDateString({}, { message: 'A data da avaliação deve estar no formato YYYY-MM-DD.' })
    @IsNotEmpty()
    data!: string;

    @IsInt({ message: 'O ID do professor deve ser um número inteiro. '})
    @IsNotEmpty()
    @Type(() => Number)
    idProfessor!: number;

    @IsInt({ message: 'O ID do aluno deve ser um número inteiro. '})
    @IsNotEmpty()
    @Type(() => Number)
    idAluno!: number;
}
