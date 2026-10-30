FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY dpr-api/package.json dpr-api/
COPY dpr-ui/package.json dpr-ui/
RUN npm ci -w dpr-api

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run db:generate
RUN npm run build -w dpr-api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dpr-api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dpr-api/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
