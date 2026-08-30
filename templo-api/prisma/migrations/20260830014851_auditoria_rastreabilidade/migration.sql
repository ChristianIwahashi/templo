-- AlterTable
ALTER TABLE `avisos_aulas` ADD COLUMN `atualizadoPorId` INTEGER NULL,
    ADD COLUMN `criadoPorId` INTEGER NULL;

-- AlterTable
ALTER TABLE `frequencias` ADD COLUMN `atualizadoPorId` INTEGER NULL,
    ADD COLUMN `criadoPorId` INTEGER NULL;

-- AlterTable
ALTER TABLE `materiais_didaticos` ADD COLUMN `atualizadoPorId` INTEGER NULL,
    ADD COLUMN `criadoPorId` INTEGER NULL;

-- AlterTable
ALTER TABLE `notas` ADD COLUMN `atualizadoPorId` INTEGER NULL,
    ADD COLUMN `criadoPorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `notas` ADD CONSTRAINT `fk_nota_criado_por` FOREIGN KEY (`criadoPorId`) REFERENCES `usuarios`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas` ADD CONSTRAINT `fk_nota_atualizado_por` FOREIGN KEY (`atualizadoPorId`) REFERENCES `usuarios`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `frequencias` ADD CONSTRAINT `fk_frequencia_criado_por` FOREIGN KEY (`criadoPorId`) REFERENCES `usuarios`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `frequencias` ADD CONSTRAINT `fk_frequencia_atualizado_por` FOREIGN KEY (`atualizadoPorId`) REFERENCES `usuarios`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avisos_aulas` ADD CONSTRAINT `fk_aviso_aula_criado_por` FOREIGN KEY (`criadoPorId`) REFERENCES `usuarios`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avisos_aulas` ADD CONSTRAINT `fk_aviso_aula_atualizado_por` FOREIGN KEY (`atualizadoPorId`) REFERENCES `usuarios`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materiais_didaticos` ADD CONSTRAINT `fk_material_didatico_criado_por` FOREIGN KEY (`criadoPorId`) REFERENCES `usuarios`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materiais_didaticos` ADD CONSTRAINT `fk_material_didatico_atualizado_por` FOREIGN KEY (`atualizadoPorId`) REFERENCES `usuarios`(`idUsuario`) ON DELETE SET NULL ON UPDATE CASCADE;
