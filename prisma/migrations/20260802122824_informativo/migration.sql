-- CreateTable
CREATE TABLE `conteudos_informativos` (
    `idConteudo` INTEGER NOT NULL AUTO_INCREMENT,
    `categoria` VARCHAR(50) NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `texto` TEXT NOT NULL,
    `imagemUrl` VARCHAR(255) NOT NULL,
    `idGestor` INTEGER NOT NULL,

    PRIMARY KEY (`idConteudo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avisos_eventos` (
    `idAvisoEvento` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `dataPostagem` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imagemUrl` VARCHAR(255) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `idGestor` INTEGER NOT NULL,

    PRIMARY KEY (`idAvisoEvento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `conteudos_informativos` ADD CONSTRAINT `conteudos_informativos_idGestor_fkey` FOREIGN KEY (`idGestor`) REFERENCES `gestores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avisos_eventos` ADD CONSTRAINT `avisos_eventos_idGestor_fkey` FOREIGN KEY (`idGestor`) REFERENCES `gestores`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;
