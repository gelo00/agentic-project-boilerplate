# Project Working Memory

## Active Invariants
- **Stack**: Next.js 16+ (App Router), React 19, Node.js 22 LTS, Tailwind CSS v4, Ant Design v5 [8, 9].
- **Data Persistence**: Port & Adapter pattern with PostgreSQL via Drizzle ORM and In-Memory fallback.
- **Contract Boundary**: `@workspace/contracts` (Zod schemas).

## Architectural Log
- Initialized monorepo with explicit FE/BE boundary, dynamic database adapters, and subagent registry.
