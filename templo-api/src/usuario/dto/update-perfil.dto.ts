import { IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

export class UpdatePerfilDto {
    @IsString({ message: 'A senha atual deve ser uma string.'})
    @IsNotEmpty({ message: 'A senha atual é obrigatória para confirmar as alterações.' })
    senhaAntiga!: string;

    @IsOptional()
    @IsString()
    @Length(10, 15, { message: 'O telefone deve ter um formato válido.'})
    telefone?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    senha?: string;
}