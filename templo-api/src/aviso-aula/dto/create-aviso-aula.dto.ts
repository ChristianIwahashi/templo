import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAvisoAulaDto {
    @IsString()
    @IsNotEmpty({ message: 'O título/texto do aviso é obrigatório.' })
    @MaxLength(255, { message: 'O aviso deve ter no máximo 255 caracteres.' })
    titulo!: string;

    @IsString()
    @IsOptional()
    imagemUrl?: string;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    idProfessor?: number;

    @IsArray({ message: 'As turmas de destino devem ser informadas como lista.' })
    @IsInt({ each: true, message: 'Cada ID de turma deve ser um número inteiro.' })
    @Type(() => Number)
    idsTurmas!: number[];
}
