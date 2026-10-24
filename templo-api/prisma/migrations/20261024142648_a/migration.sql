-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `expiracaoToken` DATETIME(3) NULL,
    ADD COLUMN `tokenRecuperacao` VARCHAR(255) NULL;
