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
- **Hoisted Single-Root Dependency Tree**: A single root `package-lock.json` governs the entire workspace. Subdirectories never maintain independent lockfiles or isolated `node_modules`, preventing singleton duplication bugs (e.g. multiple React instances) and eliminating AI hallucination of package locations.
- **OWASP-Hardened Defense in Depth**: Runtime model calls are isolated in `packages/ai-hub` to enforce OWASP LLM Top 10 defenses (LLM01 Prompt Injection, LLM02 Insecure Output Handling, LLM04 Model Resource Exhaustion, LLM06 Sensitive Information Disclosure).

---

## 2. Monorepo Workspace Architecture

The workspace is organized into clear application boundaries, shared foundational packages, centralized AI governance, and version-controlled architectural specifications:

```text
.
├── .ai/                             # Single Source of Truth for Developer Agent Governance
│   ├── memory.md                    # Living architectural invariants & long-term repository rules
│   ├── roles/                       # Specialized OWASP-hardened persona directives
│   │   ├── frontend-specialist.md   # Vite 6, React 19, Tailwind v4, Ant Design 5, zero-trust output
│   │   └── backend-specialist.md    # Clean Architecture, Express, Drizzle ORM, Zod validation
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
│   │   └── package.json             # @workspace/web
│   │
│   └── api/                         # Backend Application Service (Express Port 4000)
│       ├── src/
│       │   ├── db/                  # Pluggable persistence layer (schema.ts, migrations, factory.ts)
│       │   ├── routes/              # Express route handlers (/api/health, /api/ai)
│       │   └── index.ts             # Server entrypoint (Node.js 22 LTS, TSX runner)
│       ├── drizzle.config.ts        # Drizzle ORM configuration (pluggable drivers)
│       ├── tsconfig.json            # Server-scoped TypeScript configuration (rootDir: "src")
│       ├── .env.example             # API environment template (PORT, DB_DRIVER, DATABASE_URL)
│       └── package.json             # @workspace/api
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
│   ├── compact-sessions.mjs         # Context compaction & archiving for .ai/sessions/
│   ├── clean.mjs                    # Deep wipe of hoisted node_modules, locks, and build artifacts
│   └── clean-cache.mjs              # Granular cache clearing (--web, --api, or --all)
│
├── .github/                         # Continuous Integration Workflows
│   ├── copilot-instructions.md      # VS Code GitHub Copilot Workspace Directives
│   └── workflows/
│       └── check.yml                # CI verification pipeline (typecheck, lint, test)
│
├── AGENTS.md                        # Universal root instructions for autonomous AI agents
├── package.json                     # Root manifest (workspaces, pre-commit hooks, scripts)
├── package-lock.json                # Single root hoisted lockfile (Single Source of Truth)
├── tsconfig.base.json               # Monorepo TypeScript base configuration
└── README.md                        # Master project documentation
```

---

## 3. Centralized AI Architecture & Runtime Governance

The repository establishes a clear separation between **developer-facing AI agents** and **user-facing runtime AI models**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      DEVELOPER-FACING AI GOVERNANCE                     │
│                             (Root .ai/ Directory)                      │
│                                                                        │
│   [ GitHub Copilot ]   [ Antigravity / Cursor ]   [ Human Developers ] │
│           │                      │                        │            │
│           └──────────────────────┼────────────────────────┘            │
│                                  ▼                                     │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │ • .ai/memory.md          (Architectural Invariants)        │     │
│     │ • .ai/roles/*.md         (OWASP Frontend & Backend Roles)  │     │
│     │ • .ai/sessions/*.md      (Shared Session Audit Trail)      │     │
│     │ • docs/specs/            (IEEE 830, arc42 & ADR Specs)     │     │
│     └────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        USER-FACING RUNTIME AI ENGINE                   │
│                          (packages/ai-hub Workspace)                   │
│                                                                        │
│   [ apps/web ] ──► HTTP /api/ai ──► [ apps/api ]                       │
│                                            │                           │
│                                            ▼                           │
│                                  [ @workspace/ai-hub ]                 │
│                                  • Model Profile Routing               │
│                                  • Input Character Caps (LLM04)        │
│                                  • Timeout Guards & Retry Backoff      │
│                                  • Output Zod Validation & Masking     │
│                                            │                           │
│                 ┌──────────────────────────┼──────────────────────┐    │
│                 ▼                          ▼                      ▼    │
│        [ Local Ollama ]          [ Anthropic Claude ]    [ Google Gemini ]
└────────────────────────────────────────────────────────────────────────┘
```

### Runtime AI Profiles (`@workspace/ai-hub`)
Runtime AI features are configured in `packages/ai-hub/.env` via `AI_ACTIVE_PROFILE`:
- `default`: Connects to local Ollama (`http://localhost:11434`) with model `llama3.2:local` (zero external cloud API keys required).
- `fast`: Low-latency cloud inference (Claude 3.5 Haiku or GPT-4o-mini).
- `smart`: High-reasoning cloud inference (Claude 3.5 Sonnet or GPT-4o).
- `gemini`: Google Gemini 1.5 Pro / Flash models.
- `mock`: Deterministic responses for CI and automated test suites without network dispatch.

---

## 4. Living Architectural Specifications Framework

Requirements and architecture decisions are version-controlled alongside application code in `docs/specs/`:

1. **IEEE 830 / ISO 29148 Software Requirements Specification (`docs/specs/srs/`)**:
   - `srs.md`: Contains explicit functional (`REQ-FR-*`) and non-functional (`REQ-SEC-*`, `REQ-PERF-*`) requirements.
   - `traceability-matrix.md`: Maps every requirement directly to its implementation files and verification test suites.
2. **arc42 Pragmatic Architecture Documentation (`docs/specs/arc42/`)**:
   - Formatted in modular chapters: `01_introduction_and_goals.md`, `03_context_and_scope.md`, `05_building_block_view.md`, and `08_crosscutting_concepts.md`.
3. **Architecture Decision Records (`docs/specs/adr/`)**:
   - Structured according to `ADR-000-template.md` to preserve context on critical trade-offs (e.g. `ADR-001-vite6-tailwind4.md`, `ADR-002-ai-hub-and-governance.md`).

---

## 5. Quickstart & Developer Operations

### Prerequisites
- **Node.js**: `>= 22.0.0 LTS`
- **npm**: `>= 10.0.0`

### 1. One-Command Setup & Bootstrap
Bootstrap directories, provision environment templates, and verify clean dependencies:
```bash
npm run setup
```
*Behind the scenes, this executes `node scripts/bootstrap.mjs`, copying environment templates for `apps/web`, `apps/api`, and `packages/ai-hub`, and running pre-flight verification.*

### 2. Boot Local Development Servers
Launch both applications concurrently from the repository root:
```bash
npm run dev
```
- **Frontend Client (`apps/web`)**: [http://localhost:3000](http://localhost:3000)
- **Backend API (`apps/api`)**: [http://localhost:4000](http://localhost:4000)
- **API Health Check**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

### 3. Verification & Quality Gates
Always run from the root directory:
```bash
# Run complete quality gate (typecheck + lint)
npm run check

# Typecheck all workspaces (contracts, ai-hub, api, web)
npm run check:types

# Run ultra-fast linting and formatting validation
npm run check:lint

# Automatically fix autofixable linting and formatting issues
npm run lint:fix

# Run unit and integration test suites
npm run test
```

### 4. Cache & Dependency Management
```bash
# Deep clean: wipes all node_modules, package-lock.json, and build output
npm run clean

# Granular cache clearing (Vite, TSX, Drizzle artifacts)
npm run clean:cache -- --all
```

---

## 6. Comprehensive Git Guide & Quality Verification Gates

### Branching Model
- **`main`**: Production-ready branch. Must pass CI at all times. Direct pushes are blocked.
- **`feat/<scope>-<description>`**: New feature development (e.g., `feat/web-auth-modal`, `feat/api-ai-streaming`).
- **`fix/<scope>-<description>`**: Bug fixes and patches (e.g., `fix/contracts-zod-bounds`).
- **`docs/<scope>-<description>`**: Living specification and documentation updates (e.g., `docs/arc42-building-blocks`).

### Conventional Commits Standard
Commit messages must adhere strictly to the Conventional Commits specification:
```text
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```
- **Types**: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`.
- **Scopes**: `web`, `api`, `contracts`, `ai-hub`, `ai`, `specs`, `scripts`.
- **Example**:
  ```bash
  git commit -m "feat(ai-hub): add timeout guard and character cap for OWASP LLM04"
  git commit -m "docs(srs): add REQ-SEC-003 for strict JSON output validation"
  ```

### Automated Pre-Commit Hook (`simple-git-hooks` + `lint-staged`)
On every `git commit`, the pre-commit hook automatically:
1. Executes **`lint-staged`** (runs `oxlint --fix` and `oxfmt --write` on staged files).
2. Runs **`npm run check:types`** across all workspaces to prevent type regressions from reaching the repository.
3. Automatically runs **`scripts/compact-sessions.mjs`** to keep `.ai/sessions/` compact and clean.

---

## 7. Database Architecture & Pluggable Storage

Persistence in `apps/api` uses **Drizzle ORM** with pluggable driver resolution managed via `apps/api/.env`:

### Mode A: Offline / In-Memory (Default — Zero Dependencies)
Ideal for rapid UI prototyping, offline flights, or local CI tests. No Docker daemon or external database installation is required:
```env
# apps/api/.env
NODE_ENV=development
PORT=4000
DB_DRIVER=memory
```

### Mode B: PostgreSQL (Local or Docker)
To use native or containerized PostgreSQL:
```env
# apps/api/.env
NODE_ENV=development
PORT=4000
DB_DRIVER=postgres
DATABASE_URL=postgres://postgres:postgres@localhost:5432/app_db
```

```bash
# Apply schema changes directly to PostgreSQL
npm run db:push --workspace=@workspace/api

# Open visual Drizzle Studio schema browser
npm run db:studio --workspace=@workspace/api
```

---

## 8. Architectural Invariants & Golden Rules

1. **Contracts are Inviolable**: Never bypass `@workspace/contracts` to pass raw, untyped JSON payloads between services.
2. **Never Run Nested npm Installs**: Never run `npm install` inside subdirectories (`apps/*` or `packages/*`). Run all dependency management from the repository root.
3. **Inspect Specifications First**: Autonomous AI agents must read `.ai/memory.md` and relevant living specifications in `docs/specs/` before formulating implementation plans.
4. **Audit Completed Tasks**: Every completed multi-step engineering task or feature must append an audit record to `.ai/sessions/YYYY-MM-DD-<task>.md` adhering to `.ai/sessions/TEMPLATE.md`.
5. **Zero-Warning Gate**: Code must compile cleanly with `npm run check` (0 errors, 0 warnings) before merging.
