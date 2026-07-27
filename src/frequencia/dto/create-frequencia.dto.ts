import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsInt, IsNotEmpty } from "class-validator";

export class CreateFrequenciaDto {
    @IsDateString({}, { message: 'A data da aula deve estar no formato YYYY-MM-DD.' })
    @IsNotEmpty()
    dataAula!: string;

    @IsBoolean({ message: 'A presença deve ser um valor booleano (true para presente, false para falta).' })
    @IsNotEmpty()
    presenca!: boolean;

    @IsInt({ message: 'O ID do professor deve ser um número inteiro. '})
    @IsNotEmpty()
    @Type(() => Number)
    idProfessor!: number;

    @IsInt({ message: 'O ID do aluno deve ser um número inteiro. '})
    @IsNotEmpty()
    @Type(() => Number)
    idAluno!: number;
}
