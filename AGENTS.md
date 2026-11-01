# Universal AI Agent Governance

## 1. Operating Protocol & `.ai/` Inspection Mandate
- **Mandatory Pre-Flight Check in `.ai/`**: Before analyzing, proposing, or editing any code, every agent (GitHub Copilot, Antigravity, CLI agents) MUST inspect the `.ai/` directory tree:
  1. Read **`.ai/memory.md`** to review immutable architecture rules, conventions, and established repository patterns.
  2. Scan recent logs in **`.ai/sessions/`** (`YYYY-MM-DD-*.md`) to understand the current task state and inherit context from previous agent decisions.
- **Plan First, Implement Second**: For multi-file features or refactors, consult the living specifications in `docs/specs/srs/` (IEEE 830) and `docs/specs/arc42/`, then document your plan before modifying code.
- **Strict Single-Root Monorepo & Zero Nested node_modules Invariant**: Never run `npm install`, `npm i`, `yarn`, or `pnpm` inside child directories (`apps/web`, `apps/api`, or `packages/*`). Never create or generate a nested `node_modules/` folder inside any sub-workspace. All dependencies must be hoisted exclusively to the root `node_modules/` governed by a single root `package-lock.json`. Installing dependencies inside subdirectories violates repository invariants, breaks singletons (React, Ant Design), and causes context pollution for AI agents.
- **Verification Gates**: Every proposed change must pass `npm run check` (typecheck + lint) with zero errors.
- **Specialized Persona Activation from `.ai/roles/`**:
  - When editing client/UI code (`apps/web/**`), strictly assume the persona and rules in **`.ai/roles/frontend-specialist.md`**.
  - When editing services, routes, or database schemas (`apps/api/**`), strictly assume the persona and rules in **`.ai/roles/backend-specialist.md`**.

---

## 2. `.ai/` Directory Architecture (Single Source of Truth)
All operational agent intelligence and persistent state are centralized exclusively within `.ai/`:

```text
.ai/
├── memory.md               <-- Living repository invariants & architectural conventions
├── roles/                  <-- Domain-specific personas & OWASP coding rules
│   ├── frontend-specialist.md
│   └── backend-specialist.md
└── sessions/               <-- SINGLE SOURCE OF TRUTH for all session audits
    ├── TEMPLATE.md         <-- Audit logging standard
    └── YYYY-MM-DD-<task>.md
```

---

## 3. Boundaries & Separation of Concerns

### Frontend (`apps/web`)
- **Stack**: Vite 6, React 19, Tailwind CSS v4 (`@import "tailwindcss"` via PostCSS), and Ant Design 5.
- **Type Boundary**: Scoped strictly to `src/` (`apps/web/tsconfig.json` with `"rootDir": "src"` and `"noEmit": true`). Never import database clients, ORM schemas, or server secrets.
- **UI System**: Use Ant Design 5 for stateful/interactive widgets and Tailwind CSS v4 for structural layouts, responsive flex/grid alignments, and utility spacing.

### Backend (`apps/api`)
- **Stack**: Node.js 22 LTS, TSX runner, Express route handlers.
- **Layered Clean Architecture**:
  ```text
  [HTTP Request]
        │
        ▼ (OWASP A03 / LLM01: Zod validation via @workspace/contracts & rate-limiting)
  [Route Handler: src/routes/]
        │
        ▼ (OWASP A01 / A07: Authentication, tenant isolation & RBAC)
  [Service / Domain Layer]
        │
        ├──► (OWASP LLM01 / LLM04: Token limits & prompt isolation via @workspace/ai-hub)
        │
        ▼ (OWASP A03: Parameterized SQL builders via Drizzle ORM)
  [Database Access: src/db/ via Drizzle ORM]
        │
        ▼ (OWASP A05 / LLM06: Error masking & standardized JSON envelopes)
  [HTTP Response]
  ```
- **Type Boundary**: Uses `"noEmit": true`, inherits root `tsconfig.base.json`, and scopes Node types.
- **Database Strategy**: Schemas reside strictly in `apps/api/src/db/schema.ts`, migrations in `apps/api/src/db/migrations/`, supporting pluggable drivers via `DB_DRIVER`.

### Shared Contracts (`packages/contracts`)
- **Single Source of Truth**: Houses all shared DTOs, API models, and Zod validation schemas.
- **Cross-Workspace Imports**: Always import via `@workspace/contracts`. Never duplicate models or interfaces in `apps/web` or `apps/api`.

### Centralized AI Runtime (`packages/ai-hub`)
- All runtime AI features (model routing, prompt templates, schemas, and provider adapters) must be consumed via `@workspace/ai-hub`. Never hardcode direct SDK calls (OpenAI, Anthropic, Gemini) in controllers.

---

## 4. OWASP & LLM Security Baseline

### Injection & Input Validation (OWASP A03 & LLM01)
- **100% Zod Validation**: Every endpoint must parse `req.body`, `req.query`, and `req.params` against schemas imported from `@workspace/contracts` with `.strict()`.
- **Parameterized SQL**: All database operations must use Drizzle ORM query builders (`db.select()`, `db.insert()`, `db.update()`). Never concatenate raw SQL strings.
- **Prompt Injection Defense**: Treat all user inputs passed to `@workspace/ai-hub` as untrusted data. Explicitly isolate system instructions from user chat inputs.

### Output Handling & Client Protection (OWASP A03 & LLM02)
- **Anti-XSS**: Never use `dangerouslySetInnerHTML` or render raw, unescaped AI output directly into DOM trees.
- **Link Whitelisting**: Validate that all user- or AI-provided URLs use explicit `https:` or `http:` protocols to block `javascript:` pseudo-protocol execution.

### Access Control & Sensitive Data (OWASP A01, A05 & LLM06)
- **Default Deny**: Secure all non-public endpoints by verifying authentication and resource ownership server-side.
- **Error Masking**: Never expose raw database error stacks, internal file paths, or exceptions to clients. Return standardized envelopes:
  - Success: `{ "success": true, "data": T }`
  - Failure: `{ "success": false, "error": { "message": string, "code": string } }`
- **Secrets Management**: Load credentials strictly from environment variables (`process.env`). Never commit secrets, tokens, or private keys to git.
- **Resource Exhaustion (OWASP LLM04)**: Enforce character caps on incoming prompts and rate limiting on API and AI endpoints.

---

## 5. Session Audit Trail Protocol (`.ai/sessions/`)
- **Canonical Session Directory**: **`.ai/sessions/`** is the shared session log repository for both **Antigravity** and **GitHub Copilot**. Never create or write to `.copilot/` or `.agent/sessions/`.
- **Pre-Task Check**: Read `.ai/memory.md` and recent session logs in `.ai/sessions/` before starting any implementation.
- **Post-Task Audit Logging (Write on Completion)**:
  - Upon completing any multi-step workflow, refactor, or feature, create or append a markdown audit log directly to:
    ```text
    .ai/sessions/YYYY-MM-DD-<task-name>.md
    ```
  - Follow the structure defined in `.ai/sessions/TEMPLATE.md`, documenting:
    1. Assigned persona and agent identity (`Antigravity` or `GitHub Copilot`).
    2. Specifications referenced (`docs/specs/srs/` or `docs/specs/arc42/`).
    3. Created or modified files.
    4. Verification results (`npm run check` for TypeScript and linting).
    5. Discovered patterns or conventions to append to `.ai/memory.md`.
