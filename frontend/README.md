# Frontend - Caplink Store

Interface web desenvolvida com Next.js para o sistema de e-commerce Caplink Store.

## 🏗️ Estrutura

```
src/
├── app/                    # Pages (App Router)
│   ├── page.tsx           # Home
│   ├── layout.tsx         # Layout raiz
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── products/
│   │   ├── page.tsx       # Listagem
│   │   └── [id]/          # Detalhes
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── favorites/
│   ├── profile/
│   ├── about/
│   └── seller/
│       ├── dashboard/
│       └── products/
│
├── components/             # Componentes React
│   ├── header.tsx
│   ├── footer.tsx
│   └── ui/                # shadcn/ui components
│
├── lib/                   # Utilitários
│   ├── api.ts            # Axios instance
│   └── utils.ts          # Helpers
│
└── hooks/                 # Custom hooks
    └── use-toast.ts
```

## 🎨 Tecnologias

- **Next.js 16.0.7** - App Router + Turbopack
- **React 19** - Server e Client Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## 🔐 Autenticação

### Fluxo
1. Login/Registro via `/auth/login` ou `/auth/register`
2. Backend retorna `{ access_token, user }`
3. Token salvo em `localStorage`
4. User data salvo em `localStorage`
5. Axios interceptor adiciona token em todas as requisições

### Interceptors (lib/api.ts)

```typescript
// Request: adiciona token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: trata 401 (token inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove token e redireciona para login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

### Proteção de Rotas
Páginas protegidas verificam autenticação no `useEffect`:
```typescript
useEffect(() => {
  const user = localStorage.getItem('user');
  if (!user) {
    router.push('/auth/login');
  }
}, []);
```

## 📄 Páginas Principais

### Home (`/`)
- Hero section com CTA
- Grid de produtos em destaque (4 produtos)
- Botões de adicionar ao carrinho e favoritar
- Produtos mock quando banco vazio

### Produtos (`/products`)
- Listagem completa com paginação
- Busca por nome/descrição
- Filtros
- Cards com imagem, nome, preço, descrição

### Detalhes do Produto (`/products/[id]`)
- Imagem grande
- Informações completas
- Botão adicionar ao carrinho
- Botão favoritar
- Dados do vendedor

### Carrinho (`/cart`)
- Lista de itens
- Quantidade ajustável
- Remover itens
- Total calculado
- Botão finalizar compra

### Checkout (`/checkout`)
- Resumo do pedido
- Confirmação de compra
- Redirecionamento para histórico

### Pedidos (`/orders`)
- Histórico de compras
- Detalhes de cada pedido
- Status e total

### Favoritos (`/favorites`)
- Grid de produtos favoritados
- Remover dos favoritos
- Adicionar ao carrinho

### Perfil (`/profile`)
- Dados do usuário
- Botão excluir conta (Cliente)
- Botão desativar conta (Vendedor)

### Dashboard Vendedor (`/seller/dashboard`)
- Cards com estatísticas:
  - Total de produtos cadastrados
  - Total vendido
  - Faturamento total
  - Produto mais vendido
- Gráficos (se implementado)

### Produtos Vendedor (`/seller/products`)
- Listagem de produtos do vendedor
- Formulário de cadastro
- Upload CSV
- Editar/Deletar produtos

## 🎨 Componentes UI

### Header
- Logo e navegação
- Busca de produtos
- Ícone do carrinho com contador
- Menu do usuário (dropdown)
- Botões Login/Cadastrar (não autenticado)

### Footer
- Links rápidos
- Informações da loja
- Newsletter
- Copyright

### shadcn/ui Components
- Button
- Card
- Input
- Dialog
- Dropdown Menu
- Tooltip
- Table
- Form
- Avatar

## 🛠️ Utilitários

### lib/api.ts
- Instância Axios configurada
- Base URL: `http://localhost:3000`
- Interceptors de request/response
- Tratamento automático de autenticação

### lib/utils.ts

```typescript
// Combina classes Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata preço em R$
export function formatPrice(price: number | string): string {
  const amount = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}
```

## 🎯 Funcionalidades por Papel

### Cliente
- ✅ Buscar produtos
- ✅ Ver detalhes
- ✅ Adicionar ao carrinho
- ✅ Favoritar produtos
- ✅ Finalizar compra
- ✅ Ver histórico de pedidos
- ✅ Excluir conta

### Vendedor
- ✅ Dashboard com métricas
- ✅ Cadastrar produtos (manual)
- ✅ Upload CSV de produtos
- ✅ Editar produtos
- ✅ Deletar produtos
- ✅ Ver vendas
- ✅ Desativar conta

## 🚀 Scripts

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Lint
npm run lint
```

## 🌐 Variáveis de Ambiente

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📱 Responsividade

- Mobile-first design
- Breakpoints Tailwind:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

## 🎨 Tema e Cores

```css
/* Cores principais */
--primary: #4657E1      /* Azul */
--success: #1EC067      /* Verde */
--background: #1F1F3E   /* Azul escuro */
```

## ✨ Melhorias Implementadas

- ✅ Validação de formulários
- ✅ Feedback visual (toasts)
- ✅ Loading states
- ✅ Error handling
- ✅ Proteção de rotas
- ✅ Persistência de carrinho
- ✅ Atualização automática de contador do carrinho
- ✅ Comentários em português
- ✅ Type safety completo

## 🔄 Fluxos Principais

### Compra
1. Cliente busca produtos
2. Adiciona ao carrinho
3. Revisa carrinho
4. Finaliza compra (checkout)
5. Pedido criado
6. Carrinho limpo
7. Redirecionado para histórico

### Cadastro de Produto (Vendedor)
1. Acessa `/seller/products`
2. Preenche formulário OU faz upload CSV
3. Produto criado
4. Aparece na listagem pública
5. Visível no dashboard de vendas

### Favoritos
1. Cliente clica no ícone de coração
2. Toggle favorito (adiciona/remove)
3. Produto aparece em `/favorites`
4. Pode adicionar ao carrinho de lá

## 🎯 Próximas Melhorias

- [ ] Implementar testes (Jest + React Testing Library)
- [ ] Adicionar Storybook para componentes
- [ ] Implementar PWA
- [ ] Adicionar dark mode
- [ ] Otimizar imagens (next/image)
- [ ] Implementar ISR para páginas de produtos
- [ ] Adicionar filtros avançados
- [ ] Implementar ordenação de produtos
