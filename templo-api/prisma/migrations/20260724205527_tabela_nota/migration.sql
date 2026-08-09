-- CreateTable
CREATE TABLE `notas` (
    `idNota` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DOUBLE NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `data` DATE NOT NULL,
    `idProfessor` INTEGER NOT NULL,
    `idAluno` INTEGER NOT NULL,

    PRIMARY KEY (`idNota`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notas` ADD CONSTRAINT `notas_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas` ADD CONSTRAINT `notas_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `alunos`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
