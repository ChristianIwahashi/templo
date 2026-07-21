import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class TurmaDto {
    @IsInt({ message: 'O ID do professor deve ser um número inteiro.'})
    @IsNotEmpty({ message: 'O ID do professor é obrigatório.' })
    @Type(() => Number)
    idProfessor!: number;
}
