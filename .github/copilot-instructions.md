## 1. Monorepo Architecture & Invariants
- **Stack & Environment**: TypeScript 5.7+, Node.js 22 LTS, single-root hoisted dependencies governed by a single root `package-lock.json`. Never run `npm install` inside subdirectories.
- **Shared Contracts (`packages/contracts`)**: Single Source of Truth for shared DTOs, API models, and Zod validation schemas. Never duplicate interfaces across `apps/web` or `apps/api`.
- **Centralized AI Runtime (`packages/ai-hub`)**: All runtime AI features (model routing, prompt templates, schemas, and provider adapters) must be consumed via `@workspace/ai-hub`. Never hardcode direct SDK calls (OpenAI, Anthropic, Gemini) in controllers.
- **Verification Gates**: Every generated or refactored file must pass `npm run check` (typecheck + lint) with 0 errors.

---

## 2. Centralized Session Logging & Memory
To prevent fragmented memory and keep **GitHub Copilot** and **Antigravity** fully synchronized:
- **Canonical Session Directory**: **`.ai/sessions/`** is the **ONLY** authorized location for recording session summaries and task history. Never write logs to `.copilot/` or `.agent/sessions/`.
- **Pre-Task Check (Read First)**:
  1. Inspect `.ai/memory.md` to review established project conventions, invariants, and historical architectural patterns.
  2. Inspect the latest files in `.ai/sessions/` to inherit context and decisions from previous Copilot or Antigravity sessions before starting work.
  3. Consult living specifications in `docs/specs/srs/` and `docs/specs/arc42/` to ensure full alignment with project requirements.
- **Post-Task Audit (Write on Completion)**:
  - When completing any multi-step task, refactoring session, or feature implementation, record or append a timestamped audit markdown log to:
    ```text
    .ai/sessions/YYYY-MM-DD-<task-name>.md
    ```
  - Follow the structure defined in `.ai/sessions/TEMPLATE.md`, documenting:
    - Persona adopted (`.ai/roles/`).
    - Living documentation referenced (`docs/specs/srs/`, `docs/specs/arc42/`, or `docs/specs/adr/`).
    - Files created or modified.
    - Verification output (`npm run check`).

---

## 3. Role Activation & Boundary Separation
Whenever generating, editing, or auditing code, adopt the specialized persona based on workspace scope:

### Frontend Scope (`apps/web/**`)
- **Directives File**: Strictly adhere to `.ai/roles/frontend-specialist.md`.
- **Stack**: Vite 6, React 19, Tailwind CSS v4 (`@import "tailwindcss"` via PostCSS), and Ant Design 5.
- **Boundaries**: Strictly scoped to `apps/web/src/` (`rootDir: "src"`, `"noEmit": true`). Never import database clients, ORM schemas, or server secrets.
- **UI Design System**: Use Ant Design 5 for stateful/interactive widgets and Tailwind CSS v4 for layouts, responsive flex/grid alignments, and utility spacing.
- **OWASP A03 & LLM02 (Insecure Output Handling)**: Never use `dangerouslySetInnerHTML`. Auto-escape all model tokens and validate link protocols (`http:`, `https:`).

### Backend Scope (`apps/api/**`)
- **Directives File**: Strictly adhere to `.ai/roles/backend-specialist.md`.
- **Stack**: Node.js 22 LTS, TSX runner, Express route handlers, Drizzle ORM.
- **Layered Clean Architecture**:
  ```text
  [HTTP Request]
        │
        ▼ (OWASP A03 / LLM01: Zod validation via @workspace/contracts & rate limiting)
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