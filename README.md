# Multi-Tenant Retail Billing

TypeScript monorepo for a multi-tenant retail billing, inventory, purchasing, and reporting platform.

## Stack

- Next.js 16 + React 19
- NestJS 12 on Fastify
- PostgreSQL 17 + Drizzle ORM
- Redis 8
- pnpm workspaces + Turborepo
- Vitest and Playwright-ready test setup

## Local development

```bash
cp .env.example .env
corepack enable
pnpm install
docker compose up -d postgres redis
pnpm db:migrate
pnpm dev
```

The web app runs at `http://demo.localhost:3000` and the API at `http://localhost:4000`.

To run the complete stack in containers:

```bash
cp .env.example .env
docker compose up --build
```

## Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## Architecture

The platform starts as a modular monolith. REST is used from browser to API, Redis-backed events support live updates, and PostgreSQL is the transactional source of truth. Tenant-owned tables are protected by `tenant_id` and PostgreSQL row-level security.
