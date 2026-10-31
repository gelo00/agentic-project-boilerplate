# 📖 Operational Guide: Agentic Full-Stack Monorepo

A practical, step-by-step developer manual for building, running, and maintaining applications using this dual-audience boilerplate. This guide is designed for both human engineers and autonomous AI coding agents (Claude Code, Cursor, Copilot, Antigravity).

---

## 📑 Table of Contents

1. [Architectural Mental Model](#1-architectural-mental-model)
2. [Daily Developer Workflow & Commands](#2-daily-developer-workflow--commands)
3. [Database Management & Switching](#3-database-management--switching)
4. [Two-Phase Agentic Feature Workflow](#4-two-phase-agentic-feature-workflow)
5. [Step-by-Step Feature Implementation Example](#5-step-by-step-feature-implementation-example)
6. [Living Documentation & Memory Management](#6-living-documentation--memory-management)
7. [Golden Rules & Quality Gates](#7-golden-rules--quality-gates)

---

## 1. Architectural Mental Model

The monorepo separates concerns across three workspace tiers to enforce strict boundaries and eliminate context drift:

```text
├── packages/contracts/   ← SHARED TRUTH: Zod schemas, inferred TypeScript types, API envelopes
├── apps/api/             ← BACKEND: Pure Node.js 22 LTS with pluggable repository adapters
└── apps/web/             ← FRONTEND: Next.js 16 (App Router) + React 19 + Ant Design 5 + Tailwind CSS 4
```

### Core Principles
- **Contract-First Design**: Frontend and backend never define ad-hoc interfaces. All data transfer objects (DTOs) and request/response payloads are defined and validated in `@workspace/contracts`.
- **Pluggable Data Layer (Ports & Adapters)**: Business logic in `apps/api` depends strictly on domain repository interfaces (e.g., `IUserRepository`). The underlying persistence layer can be swapped instantly via environment configuration.
- **Dual-Audience Scaffolding**: Living specifications (`docs/srs.md`, `docs/architecture/`, and `AGENTS.md`) serve as the single source of truth for both developers and AI assistants.

---

## 2. Daily Developer Workflow & Commands

Always execute development commands from the **root directory**:

| Command | Action / Purpose |
| :--- | :--- |
| `npm run dev` | Boots both `apps/web` (port 3000) and `apps/api` (port 4000) concurrently. |
| `npm run typecheck` | Validates TypeScript compilation across `contracts`, `api`, and `web`. |
| `npm run lint` | Runs Oxlint and Oxfmt for fast code hygiene verification. |
| `npm run lint:fix` | Automatically formats and fixes autofixable lint issues. |
| `npm run test` | Executes unit and integration test suites using Vitest. |
| `npm run check` | Pre-commit quality gate (`typecheck` + `lint` + `test`). Must pass before merging. |

---

## 3. Database Management & Switching

The backend repository factory (`apps/api/src/db/factory.ts`) dynamically resolves persistence based on `apps/api/.env`:

### Mode A: Offline / In-Memory (Zero Dependencies)
Ideal for fast UI prototyping, offline work, or CI test suites. No database installation, Docker daemon, or pgAdmin connection is required:
```env
# apps/api/.env
NODE_ENV=development
PORT=4000
DB_DRIVER=memory
```
Data is held in a Node.js process `Map` and resets on server restart.

### Mode B: Local PostgreSQL & pgAdmin
Connect to native PostgreSQL or a Docker container:
```env
# apps/api/.env
NODE_ENV=development
PORT=4000
DB_DRIVER=postgres
DATABASE_URL=postgres://postgres:postgres@localhost:5432/app_db
```
To inspect data in pgAdmin:
1. Register a new server pointing to host `localhost` and port `5432`.
2. Access tables under `Databases > app_db > Schemas > public > Tables`.

### Mode C: Cloud PostgreSQL (Neon, Supabase)
The factory automatically applies SSL settings when connecting to cloud providers:
```env
# apps/api/.env
NODE_ENV=development
PORT=4000
DB_DRIVER=postgres
DATABASE_URL=postgres://user:password@ep-sample-123.us-east-2.aws.neon.tech/app_db?sslmode=require
```

---

## 4. Two-Phase Agentic Feature Workflow

To prevent AI coding assistants from hallucinating or generating uncoordinated code, follow the **Two-Phase Workflow** defined in `.ai/workflows/`:

```text
[ Feature Request ]
         │
         ▼
[ Phase 1: Planning ] ──► Draft TRD, Strategy & Checklist (No application code)
         │
         ▼
[ Human Review Gate ] ──► Verify API design, UI tokens, and test criteria
         │
         ▼
[ Phase 2: Execution ] ─► Sequential execution by domain subagents (@be / @fe)
         │
         ▼
[ Verification Gate ] ──► npm run check (Typecheck + Lint + Tests)
```

---

## 5. Step-by-Step Feature Implementation Example

Follow this blueprint when implementing any feature (e.g., `REQ-AUTH-001: User Registration`):

### Step 1: Initialize Task Context (Phase 1)
Prompt your AI coding assistant:
```markdown
Review AGENTS.md and .ai/agents/registry.json. Assume the role of @planner.
We are implementing feature REQ-AUTH-001 (User Registration).
Execute Phase 1 according to .ai/workflows/task-preparation.md:
1. Create knowledge/auth/trd.md with acceptance criteria and input validation.
2. Create knowledge/auth/implementation-strategy.md mapping contracts, API routes, and UI components.
3. Create knowledge/auth/progress.md with a granular implementation checklist.
Do not modify application code yet.
```

### Step 2: Define Shared Contract (`packages/contracts`)
Implement schemas and types first:
```typescript
// packages/contracts/src/auth.schema.ts
import { z } from 'zod';

export const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
```
Export the schema in `packages/contracts/src/index.ts` and verify with `npm run typecheck`.

### Step 3: Implement Backend Service & Route (`apps/api`)
1. Create or update domain services in `apps/api/src/modules/users/`.
2. Mount the endpoint in `apps/api/src/server.ts`:
```typescript
if (req.url === '/api/auth/register' && req.method === 'POST') {
  // Validate request body against RegisterUserSchema
  // Call user repository adapter
  // Return standard ApiResponse<T>
}
```
3. Test locally using the in-memory repository adapter.

### Step 4: Build UI Feature Slice (`apps/web`)
1. Create the form component in `apps/web/src/features/auth/RegisterForm.tsx` using Ant Design components (`<Form>`, `<Input>`, `<Button>`) styled with Tailwind CSS tokens.
2. Mount the component inside a page route (e.g., `apps/web/src/app/register/page.tsx`).
3. Connect the form submission handler to the API endpoint using the shared input types.

### Step 5: Verification & Gate
Run the unified verification command from the project root:
```bash
npm run check
```

---

## 6. Living Documentation & Memory Management

To maintain long-term alignment across sessions:

- **Requirements (`docs/srs.md`)**: Update functional requirement status (`DRAFT`, `APPROVED`, `IMPLEMENTED`).
- **Architecture (`docs/architecture/`)**: Log major component modifications in the arc42 building block views.
- **Architectural Decisions (`docs/adr/`)**: Record non-trivial trade-offs using standard MADR markdown files.
- **Session Memory (`.ai/sessions/`)**: At the end of each work session, write a summary file `{yyyy-mm-dd}-{feature-slug}.md` tracking implemented changes, known issues, and next steps to eliminate AI context poisoning.

---

## 7. Golden Rules & Quality Gates

1. **Contracts are Inviolable**: Never bypass `@workspace/contracts` to pass raw, untyped JSON payloads.
2. **Zero-Warning Builds**: Code must pass `npm run check` with exit code `0` before pushing to the repository.
3. **Plan Before Implementation**: Always require the AI assistant to outline tasks in `knowledge/<feature>/` before modifying source files.
4. **Environment Isolation**: Never commit `.env` or `.env.local` files to version control. Maintain `.env.example` as the canonical template.
