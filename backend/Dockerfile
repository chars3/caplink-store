# Dockerfile para Backend NestJS
FROM node:18-alpine AS builder

WORKDIR /app

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
FROM node:18-alpine

WORKDIR /app

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

