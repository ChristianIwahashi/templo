# ⛩️ Templo Honpa Hongwanji de Lins — Portal Institucional & Sistema de Gestão

<h1 align="center">
  <img src="./templo-frontend/public/hongwanji-roxo.png" alt="downshift logo" title="Hongwanji logo" width="150">
</h1>

> Plataforma Full-Stack que integra o **Portal Institucional Público** com um **Sistema de Gestão Educacional** para o templo Hongwanji de Lins e aulas de Nichigo Gakkou.

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Produção-success?style=for-the-badge)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## 📌 Sumário
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)

## 📖 Sobre o Projeto

O projeto foi desenvolvido para atender às necessidades do **Templo Honpa Hongwanji de Lins** e como Trabalho de Graduação (TG) do curso de Análise e Desenvolvimento de Sistemas da **Fatec de Lins**. 

A aplicação resolve o desafio de unir em um único ecossistema:
1. Uma presença web institucional para a comunidade externa e visitantes (história, festivais e galeria).
2. Um sistema seguro e restrito para gestão acadêmica, controle de frequência, notas, matrículas e mensalidade.

## ⚡ Funcionalidades

### 🌐 1. Site Institucional (Público)
- **História & Institucional:** Apresentação da fundação de 1954, pioneiros e linhagem do Shin Budismo.
- **Agenda de Eventos:** Mural dinâmico de celebrações (Hanamatsuri, Festival do Yakisoba, Iminsai).
- **Galeria de Fotos:** Acervo fotográfico interativo.
- **Aulas de Japonês:** Informações do Nichigo Gakkou como horários, mensalidade e canal de contato da secretaria.
- **Dark Mode:** Alternância nativa de temas claro/escuro com persistência local.

### 🎒 2. Portal do Aluno (Privado)
- **Boletim de Notas & Frequência:** Cálculo automático de média e percentual de presença com **filtro por Ano Letivo**.
- **Histórico de Mensalidades:** Consulta transparente de faturas, valores e status de baixa com ordenação e filtros.
- **Mural de Avisos da Turma:** Recados postados pelo professor titular com visualização de anexos.
- **Materiais Didáticos:** Download de apostilas e lições exclusivas ou destinadas à sua sala.
- **Meu Perfil:** Consulta cadastral e alteração autônoma de telefone e senha.

### 👨‍🏫 3. Painel do Professor (Privado)
- **Gerenciamento de Chamada:** Seleção de turma e data com auto-carregamento retroativo, atualização em lote e exclusão de histórico do dia.
- **Lançamento de Notas:** Lista de alunos, adição, edição e exclusão de avaliações.
- **Mural de Recados:** Criação e edição de comunicados com upload direto de imagens para nuvem.
- **Materiais Didáticos:** Upload de arquivos para a turma toda ou com **permissão exclusiva** para estudantes selecionados.
- **Exportação de Relatórios:** Geração de planilhas formatadas em **Excel (.xlsx)** com notas e frequência por ano letivo.

### 🏢 4. Painel do Gestor (Privado)
- **Gestão de Usuários:** Gestão completa de alunos e corpo docente do templo.
- **Gestão de Turmas:** Abertura de salas, atribuição de professores e vinculação direta de estudantes.
- **Gestão de Mensalidades:** Lançamento de cobranças, controle de inadimplência acumulada e baixa de pagamento.
- **Gerenciador de Conteúdo:** Publicação de notícias, fotos da galeria e eventos público.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React (v19+)** + **Vite** + **TypeScript**
- **Tailwind CSS (v4)**
- **React Router DOM (v7)**
- **Axios**
- **Lucide React**
- **SheetJS (xlsx)**

### Backend
- **NestJS (v11+)** + **TypeScript**
- **Prisma ORM (v6+)**
- **MySQL (v8+)**
- **Passport.js & JWT**
- **Bcrypt**
- **Class-Validator & Class-Transformer**
- **AWS SDK v3**
- **Brevo API SDK**

### Infraestrutura & DevOps
- **Docker**
- **Render**
- **Vercel**
- **Aiven**
- **Cloudflare R2**

## Desenvolvido por

- **Christian Iwahashi**
- **Yukito Fukagawa**
