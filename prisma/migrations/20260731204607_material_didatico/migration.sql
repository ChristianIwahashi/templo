-- CreateTable
CREATE TABLE `materiais_didaticos` (
    `idMaterial` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `arquivoUrl` VARCHAR(255) NOT NULL,
    `idProfessor` INTEGER NOT NULL,

    PRIMARY KEY (`idMaterial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `turma_material_didatico` (
    `idTurma` INTEGER NOT NULL,
    `idMaterial` INTEGER NOT NULL,
    `dataUpload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idTurma`, `idMaterial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aluno_material_didatico` (
    `idAluno` INTEGER NOT NULL,
    `idMaterial` INTEGER NOT NULL,
    `dataUpload` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idAluno`, `idMaterial`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `materiais_didaticos` ADD CONSTRAINT `materiais_didaticos_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `turma_material_didatico` ADD CONSTRAINT `turma_material_didatico_idTurma_fkey` FOREIGN KEY (`idTurma`) REFERENCES `turmas`(`idTurma`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `turma_material_didatico` ADD CONSTRAINT `turma_material_didatico_idMaterial_fkey` FOREIGN KEY (`idMaterial`) REFERENCES `materiais_didaticos`(`idMaterial`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aluno_material_didatico` ADD CONSTRAINT `aluno_material_didatico_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `alunos`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aluno_material_didatico` ADD CONSTRAINT `aluno_material_didatico_idMaterial_fkey` FOREIGN KEY (`idMaterial`) REFERENCES `materiais_didaticos`(`idMaterial`) ON DELETE CASCADE ON UPDATE CASCADE;
