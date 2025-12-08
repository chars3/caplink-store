# Backend - Caplink Store API

API REST desenvolvida com NestJS para o sistema de e-commerce Caplink Store.

## 🏗️ Arquitetura

### Módulos Principais

```
src/
├── auth/              # Autenticação JWT
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── dto/
│       └── login.dto.ts
│
├── users/             # Gerenciamento de usuários
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
│
├── products/          # CRUD de produtos + CSV upload
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── dto/
│       ├── create-product.dto.ts
│       ├── update-product.dto.ts
│       └── query-product.dto.ts
│
├── cart/              # Carrinho de compras
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   └── dto/
│       └── add-to-cart.dto.ts
│
├── orders/            # Pedidos e checkout
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── dto/
│       └── checkout.dto.ts
│
├── favorites/         # Sistema de favoritos
│   ├── favorites.controller.ts
│   ├── favorites.service.ts
│   └── dto/
│       └── add-favorite.dto.ts
│
└── prisma/            # Prisma service
    └── prisma.service.ts
```

## 🔐 Autenticação

### JWT Strategy
- Token gerado no login/registro
- Validação via Passport JWT
- Payload contém: `userId`, `email`, `role`
- Secret configurável via `.env`

### Guards
- `AuthGuard('jwt')` protege rotas autenticadas
- Validação automática de token em todas as requisições protegidas

## 📊 Banco de Dados

### Schema Prisma

**Modelos:**
- `User` - Usuários (CLIENT/SELLER)
- `Product` - Produtos cadastrados
- `Order` - Pedidos finalizados
- `OrderItem` - Itens do pedido (snapshot de preço)
- `Cart` - Carrinho do usuário
- `CartItem` - Itens no carrinho
- `Favorite` - Produtos favoritados

**Relações:**
- User 1:N Products (vendedor)
- User 1:N Orders (comprador)
- User 1:1 Cart
- User 1:N Favorites
- Order 1:N OrderItems
- Cart 1:N CartItems

### Soft Delete
- Campo `isActive` em User
- Preserva histórico de compras
- Oculta produtos de vendedores desativados

## ✅ Validação de DTOs

Todos os DTOs utilizam `class-validator` com mensagens em português:

```typescript
// Exemplo: CreateUserDto
@IsEmail({}, { message: 'email inválido' })
@IsNotEmpty({ message: 'email é obrigatório' })
email: string;

@MinLength(8, { message: 'senha deve ter no mínimo 8 caracteres' })
password: string;
```

### ValidationPipe Global
Configurado em `main.ts`:
- `whitelist: true` - Remove propriedades extras
- `forbidNonWhitelisted: true` - Rejeita propriedades não permitidas
- `transform: true` - Transforma payloads em instâncias de DTO
- `enableImplicitConversion: true` - Converte tipos automaticamente

## 📤 Upload CSV

### Endpoint
```
POST /products/upload
Content-Type: multipart/form-data
```

### Processamento
- Leitura via stream (csv-parser)
- Inserção em lotes de 1000 produtos
- Suporta grandes volumes sem timeout
- Retorna total de produtos importados

### Formato CSV
```csv
name,description,price,imageUrl
Produto 1,Descrição do produto,99.99,https://example.com/image.jpg
Produto 2,Outra descrição,149.50,https://example.com/image2.jpg
```

## 📈 Dashboard do Vendedor

### Endpoint
```
GET /orders/dashboard
Authorization: Bearer <token>
```

### Retorno
```json
{
  "totalProducts": 50,
  "totalSold": 120,
  "totalRevenue": 15000.00,
  "bestSellingProduct": {
    "id": "uuid",
    "name": "Produto Mais Vendido",
    "price": 99.99
  }
}
```

### Cálculo
- Agrega `OrderItems` onde `product.sellerId` = vendedor autenticado
- Usa preço do snapshot (não preço atual)
- Identifica produto com maior quantidade vendida

## 🔍 Busca e Paginação

### Query Parameters
```
GET /products?page=1&limit=10&search=termo&sellerId=uuid
```

### Validação (QueryProductDto)
- `page`: inteiro >= 1 (padrão: 1)
- `limit`: inteiro >= 1 (padrão: 10)
- `search`: string opcional (case-insensitive)
- `sellerId`: UUID opcional

### Filtros Automáticos
- Busca case-insensitive em nome e descrição
- Filtra apenas produtos de vendedores ativos (`seller.isActive = true`)
- Retorna `{ data: Product[], total: number }`

## 🛒 Carrinho e Checkout

### Fluxo de Checkout
1. Cliente adiciona produtos ao carrinho
2. Carrinho persiste no banco (CartItem)
3. POST `/orders/checkout`:
   - Calcula total
   - Cria Order com status COMPLETED
   - Cria OrderItems com snapshot de preços
   - Limpa carrinho
4. Retorna pedido criado

### Snapshot de Preços
OrderItem salva o preço no momento da compra:
```typescript
{
  productId: "uuid",
  quantity: 2,
  price: 99.99  // preço no momento da compra
}
```

## 🔒 Segurança

### Senhas
- Hash com bcrypt (10 rounds)
- Nunca retornadas em responses
- Validação de tamanho mínimo (8 caracteres)

### Autorização
- JWT com expiração configurável
- Validação de ownership em operações sensíveis
- Soft delete para preservar integridade

### CORS
- Habilitado para permitir frontend
- Configurável via environment

## 🚀 Scripts

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Testes
npm run test
npm run test:watch
npm run test:cov

# Prisma
npx prisma generate    # Gera Prisma Client
npx prisma db push     # Sincroniza schema com DB
npx prisma studio      # Interface visual do DB
```

## 🌐 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/caplink_store"

# JWT
JWT_SECRET="your-secret-key-here"

# Server
PORT=3000
```

## 📝 Endpoints Completos

### Auth
- `POST /auth/register` - Criar conta
- `POST /auth/login` - Login

### Products
- `GET /products` - Listar (paginado)
- `GET /products/:id` - Buscar por ID
- `POST /products` - Criar (Seller)
- `PATCH /products/:id` - Atualizar (Seller)
- `DELETE /products/:id` - Deletar (Seller)
- `POST /products/upload` - Upload CSV (Seller)

### Cart
- `GET /cart` - Ver carrinho
- `POST /cart` - Adicionar item
- `DELETE /cart/:itemId` - Remover item

### Orders
- `POST /orders/checkout` - Finalizar compra
- `GET /orders` - Histórico
- `GET /orders/:id` - Detalhes
- `GET /orders/dashboard` - Stats (Seller)
- `GET /orders/seller/sales` - Vendas (Seller)

### Favorites
- `GET /favorites` - Listar
- `POST /favorites/:productId` - Toggle

### Users
- `GET /users/:id` - Buscar
- `DELETE /users/:id` - Excluir/Desativar

## 🎯 Boas Práticas Implementadas

- ✅ Arquitetura modular (NestJS modules)
- ✅ Injeção de dependências
- ✅ DTOs com validação completa
- ✅ Comentários em português
- ✅ Type safety com TypeScript
- ✅ Tratamento de erros consistente
- ✅ Soft delete para integridade
- ✅ Paginação em todas as listagens
- ✅ Filtros no backend (não frontend)
- ✅ Transações para operações críticas
