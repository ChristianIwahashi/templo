import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAvisoEventoDto {
    @IsString()
    @IsNotEmpty({ message: 'O título é obrigatório.' })
    @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres.' })
    titulo!: string;

    @IsString()
    @IsNotEmpty({ message: 'A descrição é obrigatória.' })
    descricao!: string;

    @IsString()
    @IsOptional()
    imagemUrl?: string;

    @IsBoolean()
    @IsOptional()
    ativo?: boolean;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    idGestor!: number;
}
