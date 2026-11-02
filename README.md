# Agentic Full-Stack Monorepo

A production-oriented TypeScript monorepo designed for human developers and AI coding agents. It combines a Vite/React frontend, a Node.js API, shared contracts, pluggable persistence and caching, and a centralized AI runtime.

## Stack

- Node.js 22 LTS and TypeScript 5.7+
- Vite 6 and React 19 frontend
- Tailwind CSS 4 and Ant Design 5
- Node HTTP API with TSX
- Drizzle ORM and PostgreSQL or an in-memory repository
- Redis or an in-memory cache adapter
- Zod contracts in a shared workspace package
- Centralized AI model routing in `@workspace/ai-hub`
- npm workspaces with one root lockfile and hoisted dependencies

## Repository Layout

```text
apps/
  web/                    React 19 + Vite frontend (port 3000)
  api/                    Node.js API service (port 4000)
packages/
  contracts/              Shared Zod schemas and inferred TypeScript types
  ai-hub/                 AI profiles, prompts, providers, and guardrails
.ai/
  memory.md               Repository invariants and architectural decisions
  roles/                  Frontend and backend agent directives
  sessions/               Timestamped agent session records
docs/
  specs/srs/              Software requirements and traceability
  specs/arc42/            Architecture documentation
  adr/                    Architecture decision records
scripts/                  Bootstrap, verification, cleanup, and session tools
```

## Prerequisites

- Node.js 22 LTS
- npm
- Optional: PostgreSQL
- Optional: Redis

## Install

Install only from the repository root. The root `package-lock.json` and `node_modules` are authoritative; nested workspace dependencies are not permitted.

```bash
npm run setup
```

`setup` bootstraps the workspace, removes duplicate package trees, performs a hoisted installation, verifies the dependency tree, and runs repository checks.

To install dependencies without bootstrapping:

```bash
npm install --install-strategy=hoisted --legacy-peer-deps
```

Add dependencies to the root dependency model using a workspace command:

```bash
npm install <package> --workspace=@workspace/web
npm install <package> --workspace=@workspace/api
npm install <package> --workspace=@workspace/contracts
npm install <package> --workspace=@workspace/ai-hub
```

Do not run `npm install` inside an application or package directory.

## Development

Start both applications:

```bash
npm run dev
```

Or start them separately:

```bash
npm run dev:web
npm run dev:api
```

| Service | URL |
| --- | --- |
| Web | http://localhost:3000 |
| API root | http://localhost:4000 |
| Health endpoint | http://localhost:4000/api/health |

## Environment Configuration

The API defaults to port `4000`, the memory database adapter, and the memory cache adapter.

Copy the backend template:

```bash
cp apps/api/.env.example apps/api/.env
```

Important API variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | API listening port |
| `DB_DRIVER` | `memory` | `memory` or `postgres` |
| `DATABASE_URL` | unset | PostgreSQL connection string |
| `JWT_SECRET` | Development value | Secret for authentication-related configuration |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin |
| `REDIS_ENABLED` | `false` | Enables the Redis cache adapter |
| `REDIS_URL` | unset | Redis connection URL |
| `CACHE_TTL_SECONDS` | `300` | Cache time to live |

`DATABASE_URL` is required when `DB_DRIVER=postgres`.

The frontend environment template is `apps/web/.env.example`. The current frontend health request targets `http://localhost:4000/api/health` directly. AI Hub configuration is documented in `packages/ai-hub/.env.example`; provider credentials must stay server-side and never be exposed to the frontend.

## Architecture

### Shared contracts

`@workspace/contracts` is the source of truth for shared DTOs and Zod validation schemas. Applications should import contracts and inferred types through the workspace package rather than duplicating interfaces.

### Backend

The API uses a port-and-adapter structure:

- Database factory: `apps/api/src/db/factory.ts`
- User repository port: `apps/api/src/modules/users/user.repository.ts`
- Memory repository: `apps/api/src/db/adapters/memory.user.repo.ts`
- PostgreSQL repository: `apps/api/src/db/adapters/postgres.user.repo.ts`
- Cache factory: `apps/api/src/cache/factory.ts`
- Memory and Redis cache adapters: `apps/api/src/cache/`

The database factory selects `postgres` or `memory` based on configuration. The cache factory similarly selects Redis only when enabled and otherwise falls back to memory.

The API entrypoint is the Node.js `http` module in `apps/api/src/server.ts`; Express is not currently used.

### Frontend

The web application is a Vite SPA using React 19, Ant Design, and Tailwind CSS. It should import workspace contracts for shared types and must not access database clients or server secrets.

### AI Hub

`@workspace/ai-hub` centralizes provider and profile routing, named prompts, strict schemas, input limits, categorized error envelopes, and timeout/retry configuration.

Application code should call the AI Hub instead of provider SDKs directly. See `packages/ai-hub/README.md` for the package API. Cloud provider entries currently fall back to the mock provider when credentials are unavailable.

## Quality Gates

Run the complete verification suite:

```bash
npm run check
```

This runs dependency-integrity checks, TypeScript project-reference checks, and lint/format checks.

Other useful commands:

| Command | Purpose |
| --- | --- |
| `npm run check:modules` | Detect nested or duplicate package dependencies |
| `npm run clean:modules` | Remove detected nested dependency trees |
| `npm run check:types` | Type-check all TypeScript projects |
| `npm run check:lint` | Run Oxlint and formatting verification |
| `npm run lint` | Lint the repository |
| `npm run lint:fix` | Apply lint and formatting fixes |
| `npm test` | Run the Vitest suite |
| `npm run build` | Build all workspaces |
| `npm run clean` | Remove generated build outputs and caches |
| `npm run reset` | Clean and run the complete setup again |

The Git pre-commit hook checks duplicate dependencies, runs lint-staged fixes, and performs TypeScript verification.

## Agent Governance

Repository-specific guidance is centralized under `.ai/`:

- `.ai/memory.md` contains durable repository invariants.
- `.ai/roles/frontend-specialist.md` governs frontend work.
- `.ai/roles/backend-specialist.md` governs backend work.
- `.ai/sessions/` records completed task context.
- `AGENTS.md` defines universal agent boundaries and session audit requirements.

Agents should read `.ai/memory.md` and recent session logs before implementation, then create a session audit after completing a multi-step task or refactor.

## Specifications

Architecture and requirements are documented in:

- [`docs/specs/srs/srs.md`](docs/specs/srs/srs.md)
- [`docs/specs/srs/traceability-matrix.md`](docs/specs/srs/traceability-matrix.md)
- [`docs/specs/arc42/`](docs/specs/arc42/)
- [`docs/adr/`](docs/adr/)
