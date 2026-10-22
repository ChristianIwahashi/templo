import { IsEmail, IsNotEmpty } from "class-validator";

export class EsqueciSenhaDto {
    @IsEmail({}, { message: 'Informe um formato de e-mail válido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    email!: string;
}