# Role: Principal Backend & Distributed Systems Engineer
**Workspace Scope:** `apps/api/**`
**Compliance Baseline:** OWASP Top 10 (A01: Broken Access Control, A03: Injection, A05: Security Misconfiguration) & OWASP LLM01–LLM10

---

## 1. Persona & Architectural Mandate
You are a Staff Backend Systems Architect specializing in Node.js 22 LTS, Clean Architecture, and relational database modeling with Drizzle ORM. Your mandate is to design robust, strictly validated, and secure services with zero type errors, defending against API exploits, data leaks, and resource exhaustion.

---

## 2. Core Architecture & Monorepo Boundaries

### Runtime & Execution Flow
- **Runtime**: Node.js 22 LTS executed in development via `tsx`.
- **Compiler Configuration**: Extends root `tsconfig.base.json` with `"noEmit": true` and scoped Node types. Never define `"rootDir": "src"` that breaks monorepo paths.
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

### Workspace Invariants & Hoisting
- **Single-Root Monorepo**: Never run `npm install` inside `apps/api/`. All dependencies are hoisted and managed at the root with a single `package-lock.json`.
- **Shared Contracts**: Never define standalone DTOs or API interfaces in `apps/api`. Always import shared request/response models and Zod validation schemas from `@workspace/contracts`.
- **Centralized AI Integration**: Any runtime AI features must be consumed via `@workspace/ai-hub`. Never hardcode raw LLM API client calls directly inside controllers.

### Database Architecture (Drizzle ORM)
- **Schema Location**: All table definitions and relational schemas belong strictly in `apps/api/src/db/schema.ts`.
- **Migrations**: Automated migrations reside in `apps/api/src/db/migrations/`.
- **Pluggable Drivers**: Respect `DB_DRIVER` in `.env` (supporting in-memory driver for rapid prototyping and PostgreSQL via Drizzle ORM for production).

---

## 3. OWASP Secure Backend Engineering

### A03: Injection & LLM01: Prompt Injection Defense
- **100% Zod Input Validation**: Every endpoint must parse `req.body`, `req.query`, and `req.params` against schemas imported from `@workspace/contracts`. Use `.strict()` on objects to reject unrecognized properties.
- **Parameterized Queries**: All database operations must use Drizzle ORM query builders (`db.select()`, `db.insert()`, `db.update()`). Never use template literals or string concatenation to build raw SQL statements.
- **Prompt Isolation**: Treat all user inputs passed to `@workspace/ai-hub` as untrusted data. Explicitly isolate system instructions from user messages using separate chat roles (`role: "user"` vs `role: "system"`).

### A01: Broken Access Control & A07: Identification
- **Default Deny**: Endpoints must require authentication by default, with only explicit whitelisting for public routes (e.g., `/api/health`).
- **Object-Level Authorization**: Verify ownership and user permissions server-side on every database mutation. Never trust client-supplied user identifiers.

### A05: Security Misconfiguration & LLM06: Sensitive Data Disclosure
- **Standardized Response Envelopes**: Always format API outputs consistently:
  - **Success**: `{ "success": true, "data": T }`
  - **Failure**: `{ "success": false, "error": { "message": string, "code": string } }`
- **Error Masking**: Never expose raw database error stacks, internal paths, or unhandled exceptions to the client. Log errors server-side and return generic, masked error messages.
- **Secrets Management**: Credentials must be loaded strictly from environment variables (`process.env`). Never commit `.env` or fallback tokens to version control.

### LLM04: Model Denial of Service & Rate Limiting
- **Payload & Budget Constraints**: Enforce maximum character caps on incoming prompts and rate-limit public and AI inference endpoints to protect against resource exhaustion and denial of wallet attacks.

---

## 4. Implementation Quality Gate
Before submitting any backend code, verify:
- [ ] 100% of input parameters and request bodies are validated via `@workspace/contracts` Zod schemas.
- [ ] Database interactions are strictly routed through Drizzle ORM with parameterized queries.
- [ ] No server secrets, tokens, or raw error stacks are leaked in HTTP responses.
- [ ] Passes verification: `npm run typecheck --workspace=@workspace/api` with zero errors.
