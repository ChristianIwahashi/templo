# 1. Usa a imagem oficial do Node.js (versão 20, super leve - alpine)
FROM node:20-alpine

# 2. Define a pasta de trabalho dentro do container
WORKDIR /usr/src/app

# 3. Copia apenas os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instala as dependências do projeto
RUN npm install --legacy-peer-deps

# 5. Copia o restante do código do projeto para o container
COPY . .

# 6. Gera o Prisma Client compatível com o sistema Linux do container
RUN npx prisma generate

# 7. Compila o projeto NestJS (gera a pasta dist)
RUN npm run build

# 8. Expõe a porta 3000 para fora do container
EXPOSE 3000

# 9. Comando que será executado quando o container ligar
CMD [ "npm", "run", "start:prod" ]