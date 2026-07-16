export type Papel = 'ALUNO' | 'GESTOR' | 'PROFESSOR';

export type UsuarioDto = {
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    ativo: boolean;
    papel: Papel;
}