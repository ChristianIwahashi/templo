import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAvisoAulaDto {
    @IsString()
    @IsNotEmpty({ message: 'O título/texto do aviso é obrigatório.' })
    @MaxLength(255, { message: 'O aviso deve ter no máximo 255 caracteres.' })
    titulo!: string;

    @IsString()
    @IsOptional()
    imagemUrl?: string;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    idProfessor!: number;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    idTurma!: number;
}
