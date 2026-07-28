-- CreateTable
CREATE TABLE `frequencias` (
    `idFrequencia` INTEGER NOT NULL AUTO_INCREMENT,
    `dataAula` DATE NOT NULL,
    `presenca` BOOLEAN NOT NULL,
    `idProfessor` INTEGER NOT NULL,
    `idAluno` INTEGER NOT NULL,

    PRIMARY KEY (`idFrequencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `frequencias` ADD CONSTRAINT `frequencias_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `frequencias` ADD CONSTRAINT `frequencias_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `alunos`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
