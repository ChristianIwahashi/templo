-- AlterTable
ALTER TABLE `alunos` ADD COLUMN `idTurma` INTEGER NULL;

-- CreateTable
CREATE TABLE `turmas` (
    `idTurma` INTEGER NOT NULL AUTO_INCREMENT,
    `idProfessor` INTEGER NOT NULL,

    PRIMARY KEY (`idTurma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_idTurma_fkey` FOREIGN KEY (`idTurma`) REFERENCES `turmas`(`idTurma`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `turmas` ADD CONSTRAINT `turmas_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
