-- CreateTable
CREATE TABLE `mensalidades` (
    `idMensalidade` INTEGER NOT NULL AUTO_INCREMENT,
    `mes` VARCHAR(20) NOT NULL,
    `valor` DOUBLE NOT NULL,
    `dataVencimento` DATE NOT NULL,
    `statusPagamento` VARCHAR(50) NOT NULL,
    `idGestor` INTEGER NOT NULL,
    `idAluno` INTEGER NOT NULL,

    PRIMARY KEY (`idMensalidade`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mensalidades` ADD CONSTRAINT `mensalidades_idGestor_fkey` FOREIGN KEY (`idGestor`) REFERENCES `gestores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensalidades` ADD CONSTRAINT `mensalidades_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `alunos`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
