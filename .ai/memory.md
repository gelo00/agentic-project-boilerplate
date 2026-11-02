# Project Working Memory

## Active Invariants
- **Stack**: Next.js 16+ (App Router), React 19, Node.js 22 LTS, Tailwind CSS v4, Ant Design v5 [8, 9].
- **Data Persistence**: Port & Adapter pattern with PostgreSQL via Drizzle ORM and In-Memory fallback.
- **Contract Boundary**: `@workspace/contracts` (Zod schemas).

## Architectural Log
- Initialized monorepo with explicit FE/BE boundary, dynamic database adapters, and subagent registry.
- Dependency installation is fail-fast enforced at root and workspace boundaries; always use root npm commands or `--workspace=...`.
- Workspace runtime dependencies belong in the owning workspace manifest (`apps/api/package.json`, `apps/web/package.json`, or `packages/*/package.json`); shared build/test/tooling stays in root `package.json`. npm hoists resolved packages into root `node_modules` and the root `package-lock.json` remains authoritative.
- All external dependencies may be consolidated into the root `package.json` when the workspace intentionally uses a single-manifest model. Workspace package manifests retain workspace metadata, scripts, names, and empty dependency sections only.
