-- AlterTable
ALTER TABLE `usuarios` ALTER COLUMN `papel` DROP DEFAULT;

-- CreateTable
CREATE TABLE `gestores` (
    `idUsuario` INTEGER NOT NULL,

    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alunos` (
    `idUsuario` INTEGER NOT NULL,
    `dataNascimento` DATE NOT NULL,
    `idGestor` INTEGER NOT NULL,

    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professores` (
    `idUsuario` INTEGER NOT NULL,
    `idGestor` INTEGER NOT NULL,

    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gestores` ADD CONSTRAINT `gestores_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alunos` ADD CONSTRAINT `alunos_idGestor_fkey` FOREIGN KEY (`idGestor`) REFERENCES `gestores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professores` ADD CONSTRAINT `professores_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professores` ADD CONSTRAINT `professores_idGestor_fkey` FOREIGN KEY (`idGestor`) REFERENCES `gestores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
