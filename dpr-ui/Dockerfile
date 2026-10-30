FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY dpr-api/package.json dpr-api/
COPY dpr-ui/package.json dpr-ui/
RUN npm ci -w dpr-ui

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build -w dpr-ui

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dpr-ui/.next/standalone ./
COPY --from=builder /app/dpr-ui/.next/static ./dpr-ui/.next/static
COPY --from=builder /app/dpr-ui/public ./dpr-ui/public
EXPOSE 3000
ENV PORT=3000
CMD ["node", "dpr-ui/server.js"]
