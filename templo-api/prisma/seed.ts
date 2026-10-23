import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Pega as credenciais do .env ou usa valores seguros de fallback caso esquecça
  const emailPadrao = process.env.ADMIN_EMAIL || 'admin@templo.com';
  const senhaPadrao = process.env.ADMIN_PASSWORD;

  if (!senhaPadrao) {
    throw new Error('❌ ERRO DE SEGURANÇA: A variável de ambiente ADMIN_PASSWORD não está definida no arquivo .env!');
  }

  const gestorExistente = await prisma.usuario.findFirst({
    where: { email: emailPadrao },
  });

  if (!gestorExistente) {
    const saltRounds = 12;
    const senhaCriptografada = await bcrypt.hash(senhaPadrao, saltRounds);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const usuario = await tx.usuario.create({
        data: {
          nome: 'Administrador Geral',
          email: emailPadrao,
          senha: senhaCriptografada,
          telefone: '1435330000',
          ativo: true,
          papel: 'GESTOR',
        },
      });

      await tx.gestor.create({
        data: {
          idUsuario: usuario.idUsuario,
        },
      });
    });

    console.log('----------------------------------------------------');
    console.log('✅ PRIMEIRO GESTOR CRIADO COM SUCESSO!');('----------------------------------------------------');
  } else {
    console.log('ℹ️ O Gestor padrão já existe no banco de dados.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });