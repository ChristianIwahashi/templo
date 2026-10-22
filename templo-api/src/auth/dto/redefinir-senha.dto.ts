import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class RedefinirSenhaDto {
    @IsString()
    @IsNotEmpty({ message: 'O token de recuperação é obrigatório.' })
    token!: string;

    @IsString()
    @IsNotEmpty({ message: 'A nova senha é obrigatória.' })
    @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' })
    novaSenha!: string;
}