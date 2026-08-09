import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateMaterialDidaticoDto {
    @IsString()
    @IsNotEmpty({ message: 'O título é obrigatório.' })
    @MaxLength(255)
    titulo!: string;

    @IsString()
    @IsNotEmpty({ message: 'A descrição é obrigatória.' })
    descricao!: string;

    @IsString()
    @IsNotEmpty({ message: 'A URL do arquivo é obrigatória.' })
    arquivoUrl!: string;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    idProfessor!: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    idTurma?: number;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    idAluno?: number[]
}
