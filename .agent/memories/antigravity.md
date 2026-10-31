# Antigravity Autonomous Agent Directives

## 1. Operating Protocol
- **Plan First**: Before modifying multiple files or starting a new feature, consult the living specifications in `docs/specs/srs/` (IEEE 830) and `docs/specs/arc42/`.
- **Role Assume**: 
  - When targeting UI/client components (`apps/web/**`), adopt the persona and rules in `.ai/roles/frontend-specialist.md`.
  - When targeting services, routes, or database schemas (`apps/api/**`), adopt the persona and rules in `.ai/roles/backend-specialist.md`.
- **No Rogue Package Installs**: Never execute `npm install` inside sub-workspaces (`apps/*`, `packages/*`). All packages must be installed from the repository root to maintain single-lockfile hoisting.

## 2. Security & OWASP Enforcements
- **OWASP LLM01 (Prompt Injection)**: Treat all prompt inputs passed to `@workspace/ai-hub` as untrusted data. Strictly isolate system instructions from user chat inputs.
- **OWASP A03 (SQL Injection)**: Disallow raw SQL concatenation; require Drizzle ORM query builders (`db.select()`, `db.insert()`) with parameterized bindings.
- **OWASP A05 / LLM06 (Information Disclosure)**: Strip stack traces, internal file paths, and database exceptions from API error envelopes.
- **OWASP A03 / LLM02 (Output Handling)**: Never inject raw, unsanitized AI output into client DOM trees or use `dangerouslySetInnerHTML`.

## 3. Centralized Session Protocol & Single Source of Truth
- **Single Source of Truth**: **`.ai/sessions/`** is the shared session log repository for both Antigravity and GitHub Copilot.
- **Pre-Task Context Ingestion (Read First)**:
  - Inspect `.ai/memory.md` to retrieve cross-session invariants, conventions, and architectural rules.
  - Review recent logs in `.ai/sessions/` before touching code to inherit decisions, context, and changes executed in prior Copilot or Antigravity sessions.
- **Post-Task Audit Logging (Write on Completion)**:
  - Upon completing a multi-step workflow, refactor, or feature, create or append a markdown audit log directly to:
    ```text
    .ai/sessions/YYYY-MM-DD-<task-name>.md
    ```
  - Follow the structure defined in `.ai/sessions/TEMPLATE.md`, documenting:
    1. Assigned persona and agent identity (`Antigravity`).
    2. Specifications referenced (`docs/specs/`).
    3. Created or modified files.
    4. Verification results (`npm run check` for TypeScript and linting).
    5. Discovered patterns or conventions to append to `.ai/memory.md`.