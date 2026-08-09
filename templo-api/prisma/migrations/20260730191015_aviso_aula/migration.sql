-- CreateTable
CREATE TABLE `AvisoAula` (
    `idAvisoAula` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NOT NULL,
    `dataPostagem` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imagemUrl` VARCHAR(255) NULL,
    `idProfessor` INTEGER NOT NULL,
    `idTurma` INTEGER NOT NULL,

    PRIMARY KEY (`idAvisoAula`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AvisoAula` ADD CONSTRAINT `AvisoAula_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AvisoAula` ADD CONSTRAINT `AvisoAula_idTurma_fkey` FOREIGN KEY (`idTurma`) REFERENCES `turmas`(`idTurma`) ON DELETE RESTRICT ON UPDATE CASCADE;
