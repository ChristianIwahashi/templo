-- CreateTable
CREATE TABLE `usuarios` (
    `idUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(15) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `papel` ENUM('ALUNO', 'GESTOR', 'PROFESSOR') NOT NULL DEFAULT 'ALUNO',

    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
