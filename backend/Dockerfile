# Dockerfile para Backend NestJS
FROM node:18-slim AS builder

WORKDIR /app

# Instalar OpenSSL para Prisma
RUN apt-get update -y && apt-get install -y openssl

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Gerar Prisma Client
RUN npx prisma generate

# Imagem de produção
FROM node:18-slim

WORKDIR /app

# Instalar OpenSSL para Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copiar apenas o necessário do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Expor porta 8080 (padrão do Cloud Run)
EXPOSE 8080

# Criar script de startup
RUN echo '#!/bin/sh\n\
echo "Starting application..."\n\
echo "Generating Prisma Client..."\n\
npx prisma generate || echo "Prisma generate failed, continuing..."\n\
echo "Starting NestJS application..."\n\
exec npm run start:prod' > /app/start.sh && chmod +x /app/start.sh

# Comando para iniciar
CMD ["/app/start.sh"]

