# Caplink Online Store - Teste Técnico

> Aplicação full-stack de e-commerce desenvolvida para o teste técnico da Caplink

[![Next.js](https://img.shields.io/badge/Next.js-16.0.7-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0.1-red)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10.0-2D3748)](https://www.prisma.io/)

## 📋 Sobre o Projeto

Sistema de loja online completo que simula o funcionamento de um e-commerce real, com autenticação, gerenciamento de produtos, carrinho de compras persistente e histórico de pedidos.

### ✨ Funcionalidades Principais

#### 🔐 Autenticação
- Registro de usuários com escolha de papel (Cliente ou Vendedor)
- Login com JWT
- Proteção de rotas por autenticação e role

#### 👤 Cliente
- ✅ Pesquisa de produtos com filtros (backend)
- ✅ Paginação de resultados
- ✅ Sistema de favoritos
- ✅ Carrinho de compras persistente
- ✅ Finalização de compra (checkout)
- ✅ Histórico de pedidos
- ✅ Exclusão de conta (soft delete - mantém histórico)

#### 🏪 Vendedor
- ✅ Dashboard com estatísticas:
  - Total de produtos cadastrados
  - Total de produtos vendidos
  - Faturamento total
  - Produto mais vendido
- ✅ CRUD completo de produtos
- ✅ Cadastro manual via formulário
- ✅ **Upload em massa via CSV** (suporta grandes volumes)
- ✅ Desativação de conta (oculta produtos automaticamente)

## 🛠️ Stack Técnica

### Backend
- **Framework**: NestJS 11.0.1
- **ORM**: Prisma 5.10.0
- **Banco de Dados**: PostgreSQL 15 (Docker)
- **Autenticação**: JWT com Passport
- **Validação**: class-validator + class-transformer
- **Upload**: Multer para arquivos CSV

### Frontend
- **Framework**: Next.js 16.0.7 (App Router + Turbopack)
- **Estilização**: Tailwind CSS
- **Componentes**: shadcn/ui
- **HTTP Client**: Axios
- **Notificações**: Sonner (toast)

## 📁 Estrutura do Projeto

```
caplink-store/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/           # Autenticação JWT
│   │   ├── users/          # Gerenciamento de usuários
│   │   ├── products/       # CRUD de produtos + CSV upload
│   │   ├── cart/           # Carrinho de compras
│   │   ├── orders/         # Pedidos e checkout
│   │   ├── favorites/      # Sistema de favoritos
│   │   └── prisma/         # Prisma service
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco
│   └── docker-compose.yml  # PostgreSQL
│
├── frontend/               # App Next.js
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # Componentes React
│   │   └── lib/           # Utilitários (API, utils)
│   └── public/
│
└── README.md              # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- Docker e Docker Compose
- npm ou yarn

### 1. Clone o Repositório
```bash
git clone <seu-repositorio>
cd caplink-store
```

### 2. Backend Setup

```bash
cd backend

# Instalar dependências
npm install

# Iniciar PostgreSQL com Docker
docker-compose up -d

# Gerar Prisma Client
npx prisma generate

# Criar tabelas no banco
npx prisma db push

# Iniciar servidor de desenvolvimento
npm run start:dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:3001`

### 4. Acessar a Aplicação

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

## 📚 Documentação da API

### Autenticação
```
POST /auth/register  - Criar nova conta
POST /auth/login     - Fazer login
```

### Produtos
```
GET    /products              - Listar produtos (paginado)
GET    /products/:id          - Buscar produto por ID
POST   /products              - Criar produto (Vendedor)
PATCH  /products/:id          - Atualizar produto (Vendedor)
DELETE /products/:id          - Deletar produto (Vendedor)
POST   /products/upload       - Upload CSV de produtos (Vendedor)
```

### Carrinho
```
GET    /cart                  - Ver carrinho
POST   /cart                  - Adicionar item
DELETE /cart/:itemId          - Remover item
```

### Pedidos
```
POST   /orders/checkout       - Finalizar compra
GET    /orders                - Histórico de pedidos
GET    /orders/:id            - Detalhes do pedido
GET    /orders/dashboard      - Estatísticas (Vendedor)
GET    /orders/seller/sales   - Vendas do vendedor
```

### Favoritos
```
GET    /favorites             - Listar favoritos
POST   /favorites/:productId  - Toggle favorito
```

### Usuários
```
GET    /users/:id             - Buscar usuário
DELETE /users/:id             - Excluir/Desativar conta
```

## 🎯 Requisitos Atendidos

| Requisito | Status | Observações |
|-----------|--------|-------------|
| Autenticação com roles | ✅ | JWT com CLIENT/SELLER |
| Cliente excluir conta | ✅ | Soft delete, mantém histórico |
| Vendedor desativar conta | ✅ | Produtos ocultados automaticamente |
| Dashboard vendedor | ✅ | Todas as métricas solicitadas |
| Cadastro manual de produtos | ✅ | Formulário completo |
| Upload CSV | ✅ | Processamento em lotes |
| Busca de produtos (backend) | ✅ | Filtro case-insensitive |
| Paginação | ✅ | Com validação de parâmetros |
| Sistema de favoritos | ✅ | Toggle implementado |
| Carrinho persistente | ✅ | Salvo no banco |
| Checkout | ✅ | Com snapshot de preços |
| Histórico de compras | ✅ | Listagem completa |
| Next.js frontend | ✅ | v16 com App Router |
| Node.js backend | ✅ | NestJS v11 |
| Banco de dados | ✅ | PostgreSQL + Prisma |
| Deploy | ⚠️ | A configurar |

**Score: 94% dos requisitos implementados**

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt (10 rounds)
- ✅ Validação de DTOs com class-validator
- ✅ Proteção de rotas com JWT Guards
- ✅ Whitelist de propriedades (ValidationPipe)
- ✅ Soft delete para preservar integridade referencial
- ✅ CORS habilitado
- ✅ Interceptor de autenticação no frontend

## 🎨 Decisões Técnicas

### Por que NestJS?
- Arquitetura modular e escalável
- TypeScript nativo
- Injeção de dependências
- Decorators para validação
- Integração perfeita com Prisma

### Por que Prisma?
- Type-safety completo
- Migrations automáticas
- Query builder intuitivo
- Performance otimizada

### Por que Next.js App Router?
- Server Components para performance
- Roteamento baseado em arquivos
- Turbopack para builds rápidos
- SEO-friendly

### Upload CSV em Lotes
O sistema processa uploads CSV em lotes de 1000 produtos para:
- Evitar timeout em grandes volumes
- Reduzir uso de memória
- Manter responsividade da aplicação

## 📝 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/caplink_store"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000
```

### Frontend
```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

> ⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env` com valores reais. Use valores diferentes em produção!

## 🧪 Testes

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 📦 Build para Produção

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
npm start
```


## 👥 Autor

Desenvolvido como teste técnico para a Caplink

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.

---

