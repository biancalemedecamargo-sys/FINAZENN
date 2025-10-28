# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm e dependências
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copiar código-fonte
COPY . .

# Build do cliente e servidor
RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package.json e pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Copiar arquivos compilados do builder
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/drizzle ./drizzle

# Criar diretório para storage
RUN mkdir -p /app/storage

# Expor porta
EXPOSE 8080

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando de inicialização
CMD ["node", "server/dist/index.js"]

