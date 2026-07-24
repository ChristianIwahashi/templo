import { Type } from "class-transformer";
import { IsDateString, IsIn, IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class CreateMensalidadeDto {
    @IsString()
    @IsNotEmpty({ message: 'O mês de referência é obrigatório (ex: "Agosto/2026").' })
    mes!: string;

    @IsInt({ message: 'O valor deve ser um número inteiro representando os centavos.' })
    @Min(1, { message: 'O valor da mensalidade não pode ser zero ou negativo'})
    @Type(() => Number)
    @IsNotEmpty()
    valor!: number;

    @IsDateString({}, { message: 'A data de vencimento deve estar no formato YYYY-MM-DD.' })
    @IsNotEmpty()
    dataVencimento!: string;

    @IsString()
    @IsIn(['PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO'], {
        message: 'O status deve ser: PENDENTE, PAGO, ATRASADO ou CANCELADO.'
    })
    statusPagamento!: string;

    @IsInt({ message: 'O ID do gestor deve ser um número inteiro. '})
    @IsNotEmpty()
    @Type(() => Number)
    idGestor!: number;

    @IsInt({ message: 'O ID do aluno deve ser um número inteiro. '})
    @IsNotEmpty()
    @Type(() => Number)
    idAluno!: number;
}
