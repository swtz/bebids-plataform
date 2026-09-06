# --- Etapa 1: build ---
# Aqui instalamos TUDO (incluindo devDependencies) e compilamos o TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Copia só os arquivos de dependência primeiro (aproveita cache do Docker:
# se você não mudar o package.json, essa camada não é refeita de novo)
COPY package*.json ./
RUN npm ci

# Agora copia o resto do código e builda
COPY . .
RUN npm run build

# --- Etapa 2: produção ---
# Imagem final, só com o que é necessário pra RODAR (bem mais leve)
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copia só os arquivos de dependência e instala SÓ as de produção
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o resultado já compilado da etapa de build (pasta dist/)
COPY --from=builder /app/dist ./dist

# Porta que o NestJS escuta dentro do container
# (confira no seu main.ts qual porta ele usa — geralmente process.env.PORT)
EXPOSE 3000

CMD ["node", "dist/src/main"]
