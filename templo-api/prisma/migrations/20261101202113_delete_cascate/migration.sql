-- DropForeignKey
ALTER TABLE `avisos_aulas` DROP FOREIGN KEY `avisos_aulas_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `avisos_aulas` DROP FOREIGN KEY `avisos_aulas_idTurma_fkey`;

-- DropForeignKey
ALTER TABLE `avisos_eventos` DROP FOREIGN KEY `avisos_eventos_idGestor_fkey`;

-- DropForeignKey
ALTER TABLE `conteudos_informativos` DROP FOREIGN KEY `conteudos_informativos_idGestor_fkey`;

-- DropForeignKey
ALTER TABLE `frequencias` DROP FOREIGN KEY `frequencias_idAluno_fkey`;

-- DropForeignKey
ALTER TABLE `frequencias` DROP FOREIGN KEY `frequencias_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `materiais_didaticos` DROP FOREIGN KEY `materiais_didaticos_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `mensalidades` DROP FOREIGN KEY `mensalidades_idAluno_fkey`;

-- DropForeignKey
ALTER TABLE `notas` DROP FOREIGN KEY `notas_idAluno_fkey`;

-- DropForeignKey
ALTER TABLE `notas` DROP FOREIGN KEY `notas_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `turmas` DROP FOREIGN KEY `turmas_idProfessor_fkey`;

-- DropIndex
DROP INDEX `avisos_aulas_idProfessor_fkey` ON `avisos_aulas`;

-- DropIndex
DROP INDEX `avisos_aulas_idTurma_fkey` ON `avisos_aulas`;

-- DropIndex
DROP INDEX `avisos_eventos_idGestor_fkey` ON `avisos_eventos`;

-- DropIndex
DROP INDEX `conteudos_informativos_idGestor_fkey` ON `conteudos_informativos`;

-- DropIndex
DROP INDEX `frequencias_idAluno_fkey` ON `frequencias`;

-- DropIndex
DROP INDEX `frequencias_idProfessor_fkey` ON `frequencias`;

-- DropIndex
DROP INDEX `materiais_didaticos_idProfessor_fkey` ON `materiais_didaticos`;

-- DropIndex
DROP INDEX `mensalidades_idAluno_fkey` ON `mensalidades`;

-- DropIndex
DROP INDEX `notas_idAluno_fkey` ON `notas`;

-- DropIndex
DROP INDEX `notas_idProfessor_fkey` ON `notas`;

-- DropIndex
DROP INDEX `turmas_idProfessor_fkey` ON `turmas`;

-- AddForeignKey
ALTER TABLE `turmas` ADD CONSTRAINT `turmas_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mensalidades` ADD CONSTRAINT `mensalidades_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `alunos`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas` ADD CONSTRAINT `notas_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notas` ADD CONSTRAINT `notas_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `alunos`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `frequencias` ADD CONSTRAINT `frequencias_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `frequencias` ADD CONSTRAINT `frequencias_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `alunos`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avisos_aulas` ADD CONSTRAINT `avisos_aulas_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avisos_aulas` ADD CONSTRAINT `avisos_aulas_idTurma_fkey` FOREIGN KEY (`idTurma`) REFERENCES `turmas`(`idTurma`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materiais_didaticos` ADD CONSTRAINT `materiais_didaticos_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `professores`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conteudos_informativos` ADD CONSTRAINT `conteudos_informativos_idGestor_fkey` FOREIGN KEY (`idGestor`) REFERENCES `gestores`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avisos_eventos` ADD CONSTRAINT `avisos_eventos_idGestor_fkey` FOREIGN KEY (`idGestor`) REFERENCES `gestores`(`idUsuario`) ON DELETE CASCADE ON UPDATE CASCADE;
