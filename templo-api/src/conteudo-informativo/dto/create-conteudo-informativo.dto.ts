import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateConteudoInformativoDto {
    @IsString()
    @IsNotEmpty({ message: 'A categoria é obrigatória(ex: HISTORIA, GALERIA).' })
    categoria!: string;

    @IsString()
    @IsNotEmpty({ message: 'O título é obrigatório.' })
    @MaxLength(255, { message: 'O título deve ter no máximo 255 caracteres.' })
    titulo!: string;

    @IsString()
    @IsNotEmpty({ message: 'O texto do conteúdo é obrigatório.' })
    texto!: string;

    @IsString()
    @IsNotEmpty({ message: 'A URL da mídia (imagem/vídeo) é obrigatório.' })
    imagemUrl?: string;

    @IsInt()
    @IsNotEmpty()
    @Type(() => Number)
    idGestor!: number;
}
