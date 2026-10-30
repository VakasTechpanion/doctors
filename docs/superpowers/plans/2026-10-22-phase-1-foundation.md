# Phase 1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans for subsequent phases.

**Goal:** Runnable monorepo with database schema, NestJS API shell, Next.js landing, Docker, and CI.

**Architecture:** pnpm monorepo; Prisma in `packages/database`; NestJS global config/logging/Swagger/health; Next.js public shell.

**Tech Stack:** Next.js 15, NestJS 10, Prisma 6, PostgreSQL 16, Redis 7, Turbo, pnpm.

## Global Constraints

- Node >= 20; API prefix `api/v1`; no PHI in public routes (Phase 1).
- Payments and auth secrets from env; never commit `.env`.

---

- [x] Monorepo and workspace packages
- [x] Prisma schema + seed
- [x] NestJS config, health, Swagger, logging, exception filter
- [x] Next.js landing with API health probe
- [x] Docker Compose, CI workflow, README
