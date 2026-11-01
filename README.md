# 🌐 Agentic Full-Stack Monorepo Boilerplate
> **Production-Grade Dual-Audience Architecture for Human Engineers & Autonomous AI Agents**  
> *Vite 6 • React 19 • Tailwind CSS v4 • Ant Design 5 • Node.js 22 LTS • Drizzle ORM • Centralized AI Hub • Living Specs (IEEE 830, arc42, ADRs)*

---

## 📑 Table of Contents
1. [Executive Overview & Dual-Audience Philosophy](#1-executive-overview--dual-audience-philosophy)
2. [Monorepo Workspace Architecture](#2-monorepo-workspace-architecture)
3. [Centralized AI Architecture & Runtime Governance](#3-centralized-ai-architecture--runtime-governance)
4. [Living Architectural Specifications Framework](#4-living-architectural-specifications-framework)
5. [Quickstart & Developer Operations](#5-quickstart--developer-operations)
6. [Comprehensive Git Guide & Quality Verification Gates](#6-comprehensive-git-guide--quality-verification-gates)
7. [Database Architecture & Pluggable Storage](#7-database-architecture--pluggable-storage)
8. [Architectural Invariants & Golden Rules](#8-architectural-invariants--golden-rules)

---

## 1. Executive Overview & Dual-Audience Philosophy

This repository is engineered from the ground up as a **dual-audience platform**: an industrial-strength web application for human software engineers that simultaneously functions as an unambiguous, context-preserving environment for **autonomous AI coding assistants** (GitHub Copilot, Antigravity, Claude Code, Cursor).

### The Dual-Audience Operating Principles
- **Zero Context Drift**: Autonomous agents lose context when dependencies or conventions are scattered. All long-term repository rules are consolidated in `.ai/memory.md`, with completed task logs audited in `.ai/sessions/`.
- **Contracts-First Boundaries**: Neither the frontend (`apps/web`) nor the backend (`apps/api`) defines ad-hoc interfaces or loose types. All Data Transfer Objects (DTOs), Zod validation schemas, and API envelopes are strictly governed by `packages/contracts`.
- **Strict Single-Root Hoisted Dependency Tree**: A single root `package-lock.json` and root `/node_modules/` govern the entire workspace. Subdirectories never maintain independent lockfiles or isolated `node_modules/`, preventing duplicate singletons (React, Ant Design) and preventing AI context degradation.
- **OWASP-Hardened Defense in Depth**: Runtime model calls are isolated in `packages/ai-hub` to enforce OWASP LLM Top 10 defenses (LLM01 Prompt Injection, LLM02 Insecure Output Handling, LLM04 Model Resource Exhaustion, LLM06 Sensitive Information Disclosure).
- **Automated Pre-Commit Quality & Invariant Gates**: Git hooks powered by `simple-git-hooks` and `lint-staged` run invariant checks (`check:modules`), targeted linter fixes (`oxlint --fix`), and TypeScript project reference verification (`check:types`) before commits enter version control.

---

## 2. Monorepo Workspace Architecture

The workspace is organized into clear application boundaries, shared foundational packages, centralized AI governance, and version-controlled architectural specifications:

```text
.
├── .ai/                             # Single Source of Truth for Developer Agent Governance
│   ├── memory.md                    # Living architectural invariants & long-term repository rules
│   ├── roles/                       # Specialized OWASP-hardened persona directives
│   │   ├── frontend-specialist.md   # Vite 6, React 19, Tailwind v4, Ant Design 5, DRY hierarchy, a11y
│   │   └── backend-specialist.md    # Clean Architecture, SOLID, Node 22, Drizzle ORM, error classes
│   └── sessions/                    # Shared audit trail for Copilot, Antigravity & human developers
│       ├── TEMPLATE.md              # Standardized post-task session audit template
│       ├── archive/                 # Compacted historical sessions (automated by scripts/compact-sessions.mjs)
│       └── YYYY-MM-DD-<task>.md     # Timestamped task logs
│
├── apps/
│   ├── web/                         # Client Frontend Application (Vite Dev Port 3000)
│   │   ├── src/                     # React 19 SPA (components, hooks, App.tsx, main.tsx)
│   │   ├── index.html               # Single Page Application HTML entrypoint
│   │   ├── postcss.config.mjs       # Tailwind CSS v4 PostCSS driver
│   │   ├── vite.config.ts           # Vite 6 configuration (strict path resolution)
│   │   ├── tsconfig.json            # Browser-scoped TypeScript configuration (rootDir: "src")
│   │   ├── .env.example             # Frontend environment template (VITE_API_URL)
│   │   └── package.json             # @workspace/web (NO local node_modules permitted)
│   │
│   └── api/                         # Backend Application Service (Express Port 4000)
│       ├── src/
│       │   ├── db/                  # Pluggable persistence layer (schema.ts, migrations, factory.ts)
│       │   ├── routes/              # Express route handlers (/api/health, /api/ai)
│       │   └── index.ts             # Server entrypoint (Node.js 22 LTS, TSX runner)
│       ├── drizzle.config.ts        # Drizzle ORM configuration (pluggable drivers)
│       ├── tsconfig.json            # Server-scoped TypeScript configuration (rootDir: "src")
│       ├── .env.example             # API environment template (PORT, DB_DRIVER, DATABASE_URL)
│       └── package.json             # @workspace/api (NO local node_modules permitted)
│
├── packages/
│   ├── contracts/                   # Shared Single Source of Truth for Contracts & DTOs
│   │   ├── src/
│   │   │   ├── schemas/             # Strict Zod schemas (health.ts, ai.ts)
│   │   │   └── index.ts             # Barrel export of DTOs, schemas, and inferred TypeScript types
│   │   ├── tsconfig.json            # Pure TypeScript configuration
│   │   └── package.json             # @workspace/contracts
│   │
│   └── ai-hub/                      # Centralized Application AI Runtime Engine
│       ├── src/
│       │   ├── config.ts            # Typed environment configuration (profile routing, timeouts)
│       │   ├── prompts.ts           # Centralized system prompts & persona instructions
│       │   ├── schemas.ts           # ChatMessage, GenerateRequest, GenerateResponse Zod contracts
│       │   ├── client.ts            # AIHubClient (Ollama, Claude, OpenAI, Gemini, mock)
│       │   └── index.ts             # Barrel export of client singleton and configurations
│       ├── tsconfig.json            # Node-scoped TypeScript config (types: ["node"])
│       ├── .env.example             # Runtime AI profile & API key configuration
│       └── package.json             # @workspace/ai-hub
│
├── docs/                            # Living Architectural Specifications
│   └── specs/
│       ├── srs/                     # IEEE 830 / ISO 29148 Software Requirements Specification
│       │   ├── srs.md               # Functional & non-functional system requirements
│       │   └── traceability-matrix.md # Requirement-to-test verification mapping
│       ├── arc42/                   # arc42 Pragmatic Architecture Documentation
│       │   ├── 01_introduction_and_goals.md
│       │   ├── 03_context_and_scope.md
│       │   ├── 05_building_block_view.md
│       │   └── 08_crosscutting_concepts.md
│       └── adr/                     # Architecture Decision Records
│           ├── ADR-000-template.md  # Standard Architecture Decision Record template
│           ├── ADR-001-vite6-tailwind4.md # Frontend design system decisions
│           └── ADR-002-ai-hub-and-governance.md # AI Hub runtime vs. agent governance isolation
│
├── scripts/                         # Lifecycle, Scaffolding & Maintenance Scripts
│   ├── bootstrap.mjs                # Idempotent repository scaffolding & governance provisioning
│   ├── check-nested-modules.mjs     # Invariant verification gate (detects/purges nested node_modules)
│   ├── compact-sessions.mjs         # Context compaction & archiving for .ai/sessions/
│   ├── clean.mjs                    # Deep wipe of hoisted node_modules, locks, and build artifacts
│   └── clean-cache.mjs              # Granular cache clearing (--web, --api, or --all)
│
├── .github/                         # Continuous Integration Workflows
│   ├── copilot-instructions.md      # VS Code GitHub Copilot Workspace Directives
│   └── workflows/
│       └── check.yml                # CI verification pipeline (typecheck, lint, test)
│
├── .npmrc                           # Hoisting enforcement (install-strategy=hoisted, legacy-peer-deps=true)
├── AGENTS.md                        # Universal root instructions for autonomous AI agents
├── package.json                     # Root manifest (workspaces, pre-commit hooks, scripts)
├── package-lock.json                # Single root hoisted lockfile (Single Source of Truth)
├── tsconfig.base.json               # Monorepo TypeScript base configuration
└── README.md                        # Master project documentation
```

---

## 3. Centralized AI Architecture & Runtime Governance

To prevent hallucinated dependencies and runtime API security vulnerabilities, the repository enforces a strict two-tier separation between **agent governance** (instructions for AI assistants modifying the codebase) and **application AI** (runtime LLM features consumed by users):

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   REPOSITORY LEVEL: AGENT GOVERNANCE                   │
│  .ai/memory.md  •  .ai/roles/*.md  •  AGENTS.md  •  .github/copilot...  │
│  Guides external autonomous agents during code generation & auditing.  │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ (Enforces boundaries & quality gates)
┌────────────────────────────────────────────────────────────────────────┐
│                 APPLICATION RUNTIME: @workspace/ai-hub                 │
│  Centralized package managing model profiles, prompts, & token limits  │
└────────────────────────────────────────────────────────────────────────┘
          ▲                                              ▲
          │                                              │
┌──────────────────┐                           ┌──────────────────┐
│    apps/web      │                           │     apps/api     │
│ (Client UI Calls)│                           │(Server Inference)│
└──────────────────┘                           └──────────────────┘
```

---

## 4. Quickstart & Developer Operations

### One-Command Setup
To scaffold all directories, copy environment templates, configure `.npmrc`, install hoisted dependencies, and install Git hooks:

```bash
npm run setup
```

This single command automatically:
1. Runs `scripts/bootstrap.mjs` to scaffold missing files, `.env` templates, role directives, and pre-commit hooks.
2. Auto-purges any accidentally created nested `node_modules/` via `scripts/check-nested-modules.mjs --fix`.
3. Ensures root `.npmrc` enforces `install-strategy=hoisted` and `legacy-peer-deps=true`.
4. Installs dependencies into root `/node_modules/` with hoisted strategy.
5. Installs `simple-git-hooks` pre-commit hooks into `.git/hooks/`.
6. Executes `npm run check` to verify the baseline with 0 errors.

### Starting Development Servers
Boot frontend and backend concurrently:
```bash
npm run dev
```
- **Web Application**: [http://localhost:3000](http://localhost:3000) (Vite 6 + React 19)
- **API Server**: [http://localhost:4000](http://localhost:4000) (Node.js 22 LTS + Express)
- **Health Check**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

---

## 5. Daily CLI Commands & Quality Gates

All commands must be executed from the **monorepo root**:

| Command | Description |
| :--- | :--- |
| `npm run setup` | One-command onboarding (bootstrap, clean modules, install, verify). |
| `npm run dev` | Runs both `apps/web` and `apps/api` concurrently with colored logs. |
| `npm run check` | Unified verification gate: checks modules, types, and lints. |
| `npm run check:modules` | Verifies zero nested `node_modules` exist across `apps/` and `packages/`. |
| `npm run clean:modules` | Purges any nested `node_modules/` to restore hoisted invariant. |
| `npm run check:types` | Typechecks all sub-workspaces via TypeScript project references (`tsc -b`). |
| `npm run check:lint` | Runs fast code hygiene checks with Oxlint and Oxfmt. |
| `npm run lint:fix` | Automatically fixes linting issues and formats staged files. |
| `npm run clean` | Complete deep reset: wipes root `node_modules`, locks, and caches. |

---

## 6. Comprehensive Git Guide & Pre-Commit Gates

### Automated Pre-Commit Pipeline
When you execute `git commit`, `simple-git-hooks` and `lint-staged` automatically run three mandatory quality checks:

1. **`check:modules`**: Verifies that zero nested `node_modules/` exist inside sub-workspaces.
2. **`lint-staged`**:
   - `apps/web/**/*.{ts,tsx}`: Auto-linted with `oxlint --fix`.
   - `apps/api/**/*.{ts,js}`: Auto-linted with `oxlint --fix`.
   - `packages/**/*.{ts,js}`: Auto-linted with `oxlint --fix`.
3. **`check:types`**: Recompiles TypeScript across all workspace boundaries to prevent breaking cross-package imports.

### Git Branching & Conventional Commits
- **Branch Naming**:
  - `feat/<scope>-<description>` (e.g., `feat/auth-jwt-guard`)
  - `fix/<scope>-<description>` (e.g., `fix/api-health-cors`)
  - `docs/<scope>-<description>` (e.g., `docs/adr-003-storage`)
- **Commit Messages**: Follow standard Conventional Commits:
  - `feat(api): implement user repository with Drizzle ORM`
  - `fix(web): prevent duplicate rendering in navigation menu`
  - `chore(deps): hoist root dependencies and configure .npmrc`

---

## 7. Database Architecture & Pluggable Storage

The backend persistence layer (`apps/api/src/db/`) uses a pluggable repository pattern governed by `DB_DRIVER` in `apps/api/.env`:

### Mode A: In-Memory Driver (Default — Zero Dependencies)
Run offline without Docker, PostgreSQL, or WSL:
```env
# apps/api/.env
NODE_ENV=development
PORT=4000
DB_DRIVER=memory
```

### Mode B: Local or Hosted PostgreSQL
Connect to local PostgreSQL, Docker, or hosted serverless databases (Neon, Supabase):
```env
# apps/api/.env
NODE_ENV=development
PORT=4000
DB_DRIVER=postgres
DATABASE_URL=postgres://user:password@localhost:5432/app_db
```

Push schema updates directly:
```bash
npm run db:push --workspace=@workspace/api
npm run db:studio --workspace=@workspace/api
```

---

## 8. Architectural Invariants & Golden Rules

1. **🚫 Zero Nested `node_modules`**: Never run `npm install` inside `apps/` or `packages/`. All installations must execute from root:
   ```bash
   npm install <pkg> --workspace=@workspace/web
   ```
2. **📦 Contracts-First**: Never create ad-hoc API interfaces. Export shared Zod schemas and TypeScript types exclusively from `@workspace/contracts`.
3. **🧠 AI Runtime Isolation**: Consume model endpoints strictly through `@workspace/ai-hub`. Never hardcode LLM SDKs directly in routes or controllers.
4. **🛡️ OWASP Zero-Trust**: All backend routes validate input with `.strict()` Zod schemas. Frontend JSX auto-escapes tokens and blocks `dangerouslySetInnerHTML`.
5. **📝 Single Session Audit Trail**: Autonomous agents must log completed work directly in `.ai/sessions/YYYY-MM-DD-<task>.md` using `TEMPLATE.md`.
