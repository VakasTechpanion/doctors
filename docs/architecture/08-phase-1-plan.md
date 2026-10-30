# Phase 1 — Foundation Implementation Plan

**Goal:** Runnable monorepo with PostgreSQL, Prisma migrations, NestJS API (config, logging, Swagger, health), Next.js shell, Docker Compose, seed data, and CI skeleton.

## Acceptance Criteria

- [ ] `pnpm install` at repo root succeeds
- [ ] `docker compose up -d postgres redis` starts dependencies
- [ ] `pnpm db:migrate` applies migrations
- [ ] `pnpm db:seed` inserts roles, specialties, subscription plans (dev only)
- [ ] API starts on `:3001`, Swagger at `/api/docs`
- [ ] `GET /api/v1/health` and `/health/ready` return expected JSON
- [ ] Web starts on `:3000` with landing page linking to API health
- [ ] GitHub Actions runs lint + build on push

## Tasks Completed in This Phase

1. Monorepo: pnpm workspaces + turbo
2. `packages/database`: full Prisma schema v1 + initial migration + seed
3. `apps/api`: NestJS bootstrap, ConfigModule + Zod env validation, Pino logging, global exception filter, Prisma module, Health module, Swagger
4. `apps/web`: Next.js 15 App Router, Tailwind, minimal public home
5. `docker-compose.yml`, Dockerfiles (API, web)
6. `.env.example`, README setup steps
7. `.github/workflows/ci.yml`

## Next Phase Dependencies

Phase 2 requires: User/Role tables (present), AuthModule, email adapter stub, refresh token storage.
