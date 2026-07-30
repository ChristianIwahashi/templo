/*
  Warnings:

  - You are about to drop the `AvisoAula` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `AvisoAula` DROP FOREIGN KEY `AvisoAula_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `AvisoAula` DROP FOREIGN KEY `AvisoAula_idTurma_fkey`;

-- DropTable
DROP TABLE `AvisoAula`;

-- CreateTable
CREATE TABLE `avisos_aulas` (
    `idAvisoAula` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NOT NULL,
    `dataPostagem` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imagemUrl` VARCHAR(255) NULL,
    `idProfessor` INTEGER NOT NULL,
    `idTurma` INTEGER NOT NULL,

    PRIMARY KEY (`idAvisoAula`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `avisos_aulas` ADD CONSTRAINT `avisos_aulas_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avisos_aulas` ADD CONSTRAINT `avisos_aulas_idTurma_fkey` FOREIGN KEY (`idTurma`) REFERENCES `turmas`(`idTurma`) ON DELETE RESTRICT ON UPDATE CASCADE;
