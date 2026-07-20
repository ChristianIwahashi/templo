import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsString, Length, ValidateIf } from "class-validator";

export type Papel = 'ALUNO' | 'GESTOR' | 'PROFESSOR';

export class UsuarioDto {
    @IsString({ message: 'O nome de ser uma string.' })
    @Length(3, 100, { message: 'O nome deve ter entre 3 e 100 caracteres.' })
    nome!: string;

    @IsEmail({}, { message: 'O e-mail informado não é válido.' })
    email!: string;

    @IsString()
    @Length(6, 20, { message: 'A senha deve ter entre 6 e 20 caracteres.' })
    senha!: string;

    @IsString()
    @Length(10, 15, { message: 'O telefone deve ter um formato válido.' })
    telefone!: string;

    @IsBoolean({ message: 'O campo ativo deve ser um valor booleano (true ou false).' })
    ativo!: boolean;

    @IsEnum(['ALUNO', 'GESTOR', 'PROFESSOR'], {
        message: 'O papel deve ser ALUNO, GESTOR ou PROFESSOR.',
    })
    papel!: Papel;

    @ValidateIf(o => o.papel === 'ALUNO')
    @IsDateString({}, { message: 'A data de nascimento deve ser uma data válida (YYYY-MM-DD).' })
    dataNascimento?: string;

    @ValidateIf(o => o.papel === 'ALUNO' || o.papel === 'PROFESSOR')
    @IsInt({ message: 'O ID do gestor responsável é obrigatório para alunos e professores.' })
    @Type(() => Number)
    idGestor?: number;
}