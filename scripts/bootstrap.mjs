/**
 * @file scripts/bootstrap.mjs
 * @description Idempotent setup & scaffolding script for the Agentic Full-Stack Monorepo.
 * Automatically provisions directories, copies environment templates, and writes
 * the Universal AI Agent Governance, Copilot instructions, OWASP specialist roles,
 * and centralized .ai session logging templates.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

console.log('🚀 Initializing Agentic Monorepo Workspace Bootstrap...\n');

// 1. Required Directory Tree Scaffolding
const REQUIRED_DIRS = [
  '.ai',
  '.ai/roles',
  '.ai/sessions',
  '.github',
  '.github/workflows',
  'apps/web/src/components',
  'apps/web/src/hooks',
  'apps/api/src/db/migrations',
  'apps/api/src/routes',
  'packages/contracts/src/schemas',
  'packages/ai-hub/src',
  'docs/specs/srs',
  'docs/specs/arc42',
  'docs/specs/adr',
  'scripts',
];

console.log('📁 Scaffolding directory tree...');
for (const dir of REQUIRED_DIRS) {
  const fullPath = join(ROOT_DIR, dir);
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
    console.log(`   [Created] ${dir}`);
  }
}

// Helper to write files idempotently
function ensureFile(relPath, content, overwrite = false) {
  const fullPath = join(ROOT_DIR, relPath);
  if (!existsSync(fullPath) || overwrite) {
    writeFileSync(fullPath, content.trim() + '\n', 'utf-8');
    console.log(`   [Written] ${relPath}`);
  } else {
    console.log(`   [Exists]  ${relPath}`);
  }
}

// Helper to copy templates if destination missing
function ensureCopy(templateRelPath, destRelPath) {
  const templatePath = join(ROOT_DIR, templateRelPath);
  const destPath = join(ROOT_DIR, destRelPath);
  if (!existsSync(destPath) && existsSync(templatePath)) {
    writeFileSync(destPath, readFileSync(templatePath, 'utf-8'), 'utf-8');
    console.log(`   [Copied]  ${templateRelPath} -> ${destRelPath}`);
  }
}

console.log('\n🔒 Scaffolding AI Governance & Specialist Role Directives...');

// 2. .ai/roles/frontend-specialist.md
ensureFile(
  '.ai/roles/frontend-specialist.md',
  `# Role: Principal Frontend & UI Systems Engineer
**Workspace Scope:** \`apps/web/**\`
**Standards Compliance:** OWASP Top 10 (A03: Injection, A07: Identification Failures) & OWASP LLM02 (Insecure Output Handling)

## 1. Persona & Objective
You are a Principal Frontend Architect specializing in React 19, Vite 6, Tailwind CSS v4, and Ant Design 5. Your mandate is to engineer modular, accessible, highly responsive, and zero-trust UI components that adhere strictly to monorepo contracts and type safety.

---

## 2. Core Architectural & Development Standards

### Stack & Compiler Boundaries
- **Runtime & Bundler**: Vite 6 and React 19.
- **Styling Architecture**:
  - Global CSS entry: \`apps/web/src/index.css\` using modern \`@import "tailwindcss";\`. Never generate deprecated \`@tailwind\` directives.
  - **Ant Design 5**: Use for complex interactive UI widgets (Forms, Tables, Modals, Menus, Selects).
  - **Tailwind CSS v4**: Use for layout wrappers, responsive flex/grid alignments, and utility spacing.
- **TypeScript Boundary**: Enforced strictly to \`src/\` (\`rootDir: "src"\`, \`"noEmit": true\`).

### Separation of Concerns
- \`src/components/\`: Reusable, presentation-focused components with typed props.
- \`src/hooks/\`: Data-fetching, state lifecycle, and event-handling hooks.
- \`src/App.tsx\`: Top-level composition and layout orchestration.
- **Contracts First**: Import shared API request/response types and Zod schemas exclusively from \`@workspace/contracts\`. Never duplicate backend models inside \`apps/web\`.
- **Zero Backend Bleed**: Never import database drivers, ORM schemas, or server-side secret keys into \`apps/web\`.

---

## 3. OWASP Front-End Security Guardrails

### A03: Injection & LLM02: Insecure Output Handling
- **No Raw HTML Execution**: Never use \`dangerouslySetInnerHTML\` to render user inputs or raw AI model outputs.
- **Auto-Escaping**: Rely on React's native JSX string interpolation to sanitize and escape text tokens automatically.
- **Link Protocol Whitelisting**: When rendering links from user inputs or AI suggestions, ensure hrefs use explicit \`https:\` or \`http:\` protocols to prevent \`javascript:\` execution.

### A07: Identification & Client-Side Secrets
- **Zero Secrets in Client Bundle**: Never expose private API keys or database connection strings in Vite environment variables. Only public flags prefixed with \`VITE_\` are permitted (e.g., \`VITE_API_URL\`).
- **Storage Hygiene**: Never persist sensitive credentials, authorization tokens, or raw PII in unencrypted \`localStorage\` or \`sessionStorage\`.

---

## 4. Implementation Quality Gate
- [ ] Strictly typed props and state variables (zero \`any\`).
- [ ] Proper error boundaries, empty states, and loading skeletons for all asynchronous API calls.
- [ ] Verified under \`npm run typecheck --workspace=@workspace/web\`.
`,
  true
);

// 3. .ai/roles/backend-specialist.md
ensureFile(
  '.ai/roles/backend-specialist.md',
  `# Role: Principal Backend & Distributed Systems Engineer
**Workspace Scope:** \`apps/api/**\`
**Compliance Baseline:** OWASP Top 10 (A01: Broken Access Control, A03: Injection, A05: Security Misconfiguration) & OWASP LLM01–LLM10

---

## 1. Persona & Architectural Mandate
You are a Staff Backend Systems Architect specializing in Node.js 22 LTS, Clean Architecture, and relational database modeling with Drizzle ORM. Your mandate is to design robust, strictly validated, and secure services with zero type errors, defending against API exploits, data leaks, and resource exhaustion.

---

## 2. Core Architecture & Monorepo Boundaries

### Runtime & Execution Flow
- **Runtime**: Node.js 22 LTS executed in development via \`tsx\`.
- **Compiler Configuration**: Extends root \`tsconfig.base.json\` with \`"noEmit": true\` and scoped Node types. Never define \`"rootDir": "src"\` that breaks monorepo paths.
- **Layered Clean Architecture**:
  \`\`\`text
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
  \`\`\`

### Workspace Invariants & Hoisting
- **Single-Root Monorepo**: Never run \`npm install\` inside \`apps/api/\`. All dependencies are hoisted and managed at the root with a single \`package-lock.json\`.
- **Shared Contracts**: Never define standalone DTOs or API interfaces in \`apps/api\`. Always import shared request/response models and Zod validation schemas from \`@workspace/contracts\`.
- **Centralized AI Integration**: Any runtime AI features must be consumed via \`@workspace/ai-hub\`. Never hardcode raw LLM API client calls directly inside controllers.

### Database Architecture (Drizzle ORM)
- **Schema Location**: All table definitions and relational schemas belong strictly in \`apps/api/src/db/schema.ts\`.
- **Migrations**: Automated migrations reside in \`apps/api/src/db/migrations/\`.
- **Pluggable Drivers**: Respect \`DB_DRIVER\` in \`.env\` (supporting in-memory driver for rapid prototyping and PostgreSQL via Drizzle ORM for production).

---

## 3. OWASP Secure Backend Engineering

### A03: Injection & LLM01: Prompt Injection Defense
- **100% Zod Input Validation**: Every endpoint must parse \`req.body\`, \`req.query\`, and \`req.params\` against schemas imported from \`@workspace/contracts\`. Use \`.strict()\` on objects to reject unrecognized properties.
- **Parameterized Queries**: All database operations must use Drizzle ORM query builders (\`db.select()\`, \`db.insert()\`, \`db.update()\`). Never use template literals or string concatenation to build raw SQL statements.
- **Prompt Isolation**: Treat all user inputs passed to \`@workspace/ai-hub\` as untrusted data. Explicitly isolate system instructions from user messages using separate chat roles (\`role: "user"\` vs \`role: "system"\`).

### A01: Broken Access Control & A07: Identification
- **Default Deny**: Endpoints must require authentication by default, with only explicit whitelisting for public routes (e.g., \`/api/health\`).
- **Object-Level Authorization**: Verify ownership and user permissions server-side on every database mutation. Never trust client-supplied user identifiers.

### A05: Security Misconfiguration & LLM06: Sensitive Data Disclosure
- **Standardized Response Envelopes**: Always format API outputs consistently:
  - **Success**: \`{ "success": true, "data": T }\`
  - **Failure**: \`{ "success": false, "error": { "message": string, "code": string } }\`
- **Error Masking**: Never expose raw database error stacks, internal paths, or unhandled exceptions to the client. Log errors server-side and return generic, masked error messages.
- **Secrets Management**: Credentials must be loaded strictly from environment variables (\`process.env\`). Never commit \`.env\` or fallback tokens to version control.

### LLM04: Model Denial of Service & Rate Limiting
- **Payload & Budget Constraints**: Enforce maximum character caps on incoming prompts and rate-limit public and AI inference endpoints to protect against resource exhaustion and denial of wallet attacks.

---

## 4. Implementation Quality Gate
Before submitting any backend code, verify:
- [ ] 100% of input parameters and request bodies are validated via \`@workspace/contracts\` Zod schemas.
- [ ] Database interactions are strictly routed through Drizzle ORM with parameterized queries.
- [ ] No server secrets, tokens, or raw error stacks are leaked in HTTP responses.
- [ ] Passes verification: \`npm run typecheck --workspace=@workspace/api\` with zero errors.
`,
  true
);

// 4. .ai/memory.md
ensureFile(
  '.ai/memory.md',
  `# Repository Invariants & Long-Term Memory

## 1. Monorepo Architectural Invariants
- Single-root hoisted dependencies: Only one root \`package-lock.json\`. Never run package management in child folders.
- Contracts First: All shared DTOs, request/response models, and Zod schemas reside in \`packages/contracts\`.
- AI Hub Routing: Model profiles and runtime prompts reside in \`packages/ai-hub\`.

## 2. Verified Workarounds & Lessons Learned
- **TypeScript Path Resolution**: Never configure \`"rootDir": "src"\` in child packages if importing across workspace boundaries without proper project references. Sub-workspaces use \`"noEmit": true\` and inherit root \`tsconfig.base.json\`.
- **Tailwind CSS v4**: Enforced via \`@import "tailwindcss";\` in \`apps/web/src/index.css\`. Deprecated \`@tailwind\` directives must never be generated.
- **OWASP Baseline**: 100% Zod validation on API endpoints, parameterized Drizzle queries, and zero unescaped HTML on the client.
`,
  false
);

// 5. .ai/sessions/TEMPLATE.md
ensureFile(
  '.ai/sessions/TEMPLATE.md',
  `# Session: [YYYY-MM-DD] - <Task Name>

- **Agent / Tool**: GitHub Copilot | Antigravity | CLI Agent
- **Persona Assumed**: Principal Frontend Engineer | Principal Backend Engineer
- **Status**: Completed | In Progress | Blocked

## 1. Intent & Specs Consulted
- Living specs: \`docs/specs/srs/\` or \`docs/specs/arc42/\`
- Prior context: \`.ai/memory.md\`

## 2. Changes Executed
- Modified / Created files:
  - \`apps/...\`
  - \`packages/...\`

## 3. Verification & OWASP Checks
- [ ] Executed \`npm run check\` (typecheck + lint passed with 0 errors)
- [ ] Zod schema validation applied (\`@workspace/contracts\`)
- [ ] Parameterized database queries verified (Drizzle ORM)
- [ ] Client XSS defenses verified (zero \`dangerouslySetInnerHTML\`)

## 4. Learnings & Memory Updates
- Any discovered pattern appended to \`.ai/memory.md\`
`,
  true
);

// 6. AGENTS.md (Root Universal Governance)
ensureFile(
  'AGENTS.md',
  `# Universal AI Agent Governance

## 1. Operating Protocol & \`.ai/\` Inspection Mandate
- **Mandatory Pre-Flight Check in \`.ai/\`**: Before analyzing, proposing, or editing any code, every agent (GitHub Copilot, Antigravity, CLI agents) MUST inspect the \`.ai/\` directory tree:
  1. Read **\`.ai/memory.md\`** to review immutable architecture rules, conventions, and established repository patterns.
  2. Scan recent logs in **\`.ai/sessions/\`** (\`YYYY-MM-DD-*.md\`) to understand the current task state and inherit context from previous agent decisions.
- **Plan First, Implement Second**: For multi-file features or refactors, consult the living specifications in \`docs/specs/srs/\` (IEEE 830) and \`docs/specs/arc42/\`, then document your plan before modifying code.
- **Strict Single-Root Monorepo**: Never run \`npm install\` inside sub-workspaces (\`apps/*\` or \`packages/*\`). Maintain a single root \`package-lock.json\` with hoisted dependencies.
- **Verification Gates**: Every proposed change must pass \`npm run check\` (typecheck + lint) with zero errors.
- **Specialized Persona Activation from \`.ai/roles/\`**:
  - When editing client/UI code (\`apps/web/**\`), strictly assume the persona and rules in **\`.ai/roles/frontend-specialist.md\`**.
  - When editing services, routes, or database schemas (\`apps/api/**\`), strictly assume the persona and rules in **\`.ai/roles/backend-specialist.md\`**.

---

## 2. \`.ai/\` Directory Architecture (Single Source of Truth)
All operational agent intelligence and persistent state are centralized exclusively within \`.ai/\`:

\`\`\`text
.ai/
├── memory.md               <-- Living repository invariants & architectural conventions
├── roles/                  <-- Domain-specific personas & OWASP coding rules
│   ├── frontend-specialist.md
│   └── backend-specialist.md
└── sessions/               <-- SINGLE SOURCE OF TRUTH for all session audits
    ├── TEMPLATE.md         <-- Audit logging standard
    └── YYYY-MM-DD-<task>.md
\`\`\`

---

## 3. Boundaries & Separation of Concerns

### Frontend (\`apps/web\`)
- **Stack**: Vite 6, React 19, Tailwind CSS v4 (\`@import "tailwindcss"\` via PostCSS), and Ant Design 5.
- **Type Boundary**: Scoped strictly to \`src/\` (\`apps/web/tsconfig.json\` with \`"rootDir": "src"\` and \`"noEmit": true\`). Never import database clients, ORM schemas, or server secrets.
- **UI System**: Use Ant Design 5 for stateful/interactive widgets and Tailwind CSS v4 for structural layouts, responsive flex/grid alignments, and utility spacing.

### Backend (\`apps/api\`)
- **Stack**: Node.js 22 LTS, TSX runner, Express route handlers.
- **Layered Clean Architecture**:
  \`\`\`text
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
  \`\`\`
- **Type Boundary**: Uses \`"noEmit": true\`, inherits root \`tsconfig.base.json\`, and scopes Node types.
- **Database Strategy**: Schemas reside strictly in \`apps/api/src/db/schema.ts\`, migrations in \`apps/api/src/db/migrations/\`, supporting pluggable drivers via \`DB_DRIVER\`.

### Shared Contracts (\`packages/contracts\`)
- **Single Source of Truth**: Houses all shared DTOs, API models, and Zod validation schemas.
- **Cross-Workspace Imports**: Always import via \`@workspace/contracts\`. Never duplicate models or interfaces in \`apps/web\` or \`apps/api\`.

### Centralized AI Runtime (\`packages/ai-hub\`)
- All runtime AI features (model routing, prompt templates, schemas, and provider adapters) must be consumed via \`@workspace/ai-hub\`. Never hardcode direct SDK calls (OpenAI, Anthropic, Gemini) in controllers.

---

## 4. OWASP & LLM Security Baseline

### Injection & Input Validation (OWASP A03 & LLM01)
- **100% Zod Validation**: Every endpoint must parse \`req.body\`, \`req.query\`, and \`req.params\` against schemas imported from \`@workspace/contracts\` with \`.strict()\`.
- **Parameterized SQL**: All database operations must use Drizzle ORM query builders (\`db.select()\`, \`db.insert()\`, \`db.update()\`). Never concatenate raw SQL strings.
- **Prompt Injection Defense**: Treat all user inputs passed to \`@workspace/ai-hub\` as untrusted data. Explicitly isolate system instructions from user chat inputs.

### Output Handling & Client Protection (OWASP A03 & LLM02)
- **Anti-XSS**: Never use \`dangerouslySetInnerHTML\` or render raw, unescaped AI output directly into DOM trees.
- **Link Whitelisting**: Validate that all user- or AI-provided URLs use explicit \`https:\` or \`http:\` protocols to block \`javascript:\` pseudo-protocol execution.

### Access Control & Sensitive Data (OWASP A01, A05 & LLM06)
- **Default Deny**: Secure all non-public endpoints by verifying authentication and resource ownership server-side.
- **Error Masking**: Never expose raw database error stacks, internal file paths, or exceptions to clients. Return standardized envelopes:
  - Success: \`{ "success": true, "data": T }\`
  - Failure: \`{ "success": false, "error": { "message": string, "code": string } }\`
- **Secrets Management**: Load credentials strictly from environment variables (\`process.env\`). Never commit secrets, tokens, or private keys to git.
- **Resource Exhaustion (OWASP LLM04)**: Enforce character caps on incoming prompts and rate limiting on API and AI endpoints.

---

## 5. Session Audit Trail Protocol (\`.ai/sessions/\`)
- **Canonical Session Directory**: **\`.ai/sessions/\`** is the shared session log repository for both **Antigravity** and **GitHub Copilot**. Never create or write to \`.copilot/\` or \`.agent/sessions/\`.
- **Pre-Task Check**: Read \`.ai/memory.md\` and recent session logs in \`.ai/sessions/\` before starting any implementation.
- **Post-Task Audit Logging (Write on Completion)**:
  - Upon completing any multi-step workflow, refactor, or feature, create or append a markdown audit log directly to:
    \`\`\`text
    .ai/sessions/YYYY-MM-DD-<task-name>.md
    \`\`\`
  - Follow the structure defined in \`.ai/sessions/TEMPLATE.md\`, documenting:
    1. Assigned persona and agent identity (\`Antigravity\` or \`GitHub Copilot\`).
    2. Specifications referenced (\`docs/specs/srs/\` or \`docs/specs/arc42/\`).
    3. Created or modified files.
    4. Verification results (\`npm run check\` for TypeScript and linting).
    5. Discovered patterns or conventions to append to \`.ai/memory.md\`.
`,
  true
);

// 7. .github/copilot-instructions.md
ensureFile(
  '.github/copilot-instructions.md',
  `# GitHub Copilot Workspace Directives

## 1. Monorepo Architecture & Invariants
- **Stack & Environment**: TypeScript 5.7+, Node.js 22 LTS, single-root hoisted dependencies governed by a single root \`package-lock.json\`. Never run \`npm install\` inside subdirectories.
- **Shared Contracts (\`packages/contracts\`)**: Single Source of Truth for shared DTOs, API models, and Zod validation schemas. Never duplicate interfaces across \`apps/web\` or \`apps/api\`.
- **Centralized AI Runtime (\`packages/ai-hub\`)**: All runtime AI features (model routing, prompt templates, schemas, and provider adapters) must be consumed via \`@workspace/ai-hub\`. Never hardcode direct SDK calls (OpenAI, Anthropic, Gemini) in controllers.
- **Verification Gates**: Every generated or refactored file must pass \`npm run check\` (typecheck + lint) with 0 errors.

---

## 2. Centralized Session Logging (Single Source of Truth)
To prevent fragmented memory and keep **GitHub Copilot** and **Antigravity** fully synchronized:
- **Canonical Session Directory**: **\`.ai/sessions/\`** is the **ONLY** authorized location for recording session summaries and task history. Never write logs to \`.copilot/\` or \`.agent/sessions/\`.
- **Pre-Task Check (Read First)**:
  1. Inspect \`.ai/memory.md\` to review established project conventions, invariants, and historical architectural patterns.
  2. Inspect the latest files in \`.ai/sessions/\` to inherit context and decisions from previous Copilot or Antigravity sessions before starting work.
- **Post-Task Audit (Write on Completion)**:
  - When completing any multi-step task, refactoring session, or feature implementation, record or append a timestamped audit markdown log to:
    \`\`\`text
    .ai/sessions/YYYY-MM-DD-<task-name>.md
    \`\`\`
  - Follow the structure defined in \`.ai/sessions/TEMPLATE.md\`.

---

## 3. Role Activation & Boundary Separation
Whenever generating, editing, or auditing code, adopt the specialized persona based on workspace scope:

### Frontend Scope (\`apps/web/**\`)
- **Directives File**: Strictly adhere to \`.ai/roles/frontend-specialist.md\`.
- **Stack**: Vite 6, React 19, Tailwind CSS v4 (\`@import "tailwindcss"\` via PostCSS), and Ant Design 5.
- **Boundaries**: Strictly scoped to \`apps/web/src/\` (\`rootDir: "src"\`, \`"noEmit": true\`). Never import database clients, ORM schemas, or server secrets.
- **UI Design System**: Use Ant Design 5 for stateful/interactive widgets and Tailwind CSS v4 for layouts, responsive flex/grid alignments, and utility spacing.
- **OWASP A03 & LLM02 (Insecure Output Handling)**: Never use \`dangerouslySetInnerHTML\`. Auto-escape all model tokens and validate link protocols (\`http:\`, \`https:\`).

### Backend Scope (\`apps/api/**\`)
- **Directives File**: Strictly adhere to \`.ai/roles/backend-specialist.md\`.
- **Stack**: Node.js 22 LTS, TSX runner, Express route handlers, Drizzle ORM.
- **Layered Clean Architecture**:
  \`\`\`text
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
  \`\`\`
- **Database Strategy**: Schemas reside strictly in \`apps/api/src/db/schema.ts\`, migrations in \`apps/api/src/db/migrations/\`, supporting pluggable drivers via \`DB_DRIVER\`.
`,
  true
);

// 8. Environment File Provisioning & AI Hub Configuration Templates
console.log('\n⚙️ Provisioning environment templates & AI Hub configurations...');

const AI_HUB_ENV_TEMPLATE = [
  '# ============================================================================== #',
  '# AI HUB CENTRALIZED RUNTIME CONFIGURATION (@workspace/ai-hub)',
  '# ============================================================================== #',
  '# All runtime AI features (model routing, provider adapters, token limits,',
  '# and system prompts) are managed centrally through @workspace/ai-hub.',
  '# Never expose these private keys to client-side bundles (apps/web).',
  '# ============================================================================== #',
  '',
  '# ------------------------------------------------------------------------------ #',
  '# 1. Active Profile & Model Routing',
  '# ------------------------------------------------------------------------------ #',
  '# Determines which preset model profile to route requests through.',
  '# Supported profiles:',
  '#   - default : Uses local Ollama (zero API key dependency, ideal for offline/dev)',
  '#   - fast    : Optimized for low latency and high throughput (e.g., Claude 3.5 Haiku, GPT-4o-mini)',
  '#   - smart   : Optimized for complex reasoning, code analysis, and planning (e.g., Claude 3.5 Sonnet, GPT-4o)',
  '#   - gemini  : Uses Google Gemini models (e.g., Gemini 1.5 Pro / Flash)',
  '#   - mock    : Returns deterministic responses for CI test suites without network calls',
  'AI_ACTIVE_PROFILE=default',
  '',
  '# ------------------------------------------------------------------------------ #',
  '# 2. Cloud Model Provider API Keys',
  '# ------------------------------------------------------------------------------ #',
  '# Leave blank if using the offline default (Ollama) or mock profiles.',
  '# When activating cloud profiles, supply the corresponding provider key.',
  '',
  '# Anthropic Claude API (Required if using Claude-based smart/fast profiles)',
  '# Format: sk-ant-api03-...',
  'ANTHROPIC_API_KEY=',
  '',
  '# OpenAI API (Required if using OpenAI-based profiles)',
  '# Format: sk-proj-...',
  'OPENAI_API_KEY=',
  '',
  '# Google Gemini API (Required if using Gemini profiles)',
  '# Format: AIzaSy...',
  'GEMINI_API_KEY=',
  '',
  '# ------------------------------------------------------------------------------ #',
  '# 3. Local / Self-Hosted Inference (Ollama)',
  '# ------------------------------------------------------------------------------ #',
  '# Base URL for local Ollama instance (default port is 11434).',
  '# Used when AI_ACTIVE_PROFILE is set to default or any local LLM profile.',
  '# Ensure Ollama is running and has the target model pulled (e.g., ollama run llama3.2).',
  'OLLAMA_BASE_URL=http://localhost:11434',
  '',
  '# ------------------------------------------------------------------------------ #',
  '# 4. Resilience, Rate Limiting & OWASP LLM04 Defenses',
  '# ------------------------------------------------------------------------------ #',
  '# Maximum execution timeout in milliseconds before aborting inference calls.',
  '# Defends against hung network requests and long-tail latency (Default: 30000ms / 30s).',
  'AI_TIMEOUT_MS=30000',
  '',
  '# Number of retry attempts on transient network errors (e.g., HTTP 429, 503)',
  '# Uses exponential backoff before bubbling an error up to the service layer.',
  'AI_MAX_RETRIES=2',
  '',
  '# Maximum allowable input character length for prompt payloads.',
  '# Enforces OWASP LLM04 defense against resource exhaustion and denial of wallet attacks.',
  'AI_MAX_INPUT_CHARS=10000',
  ''
].join('\n');

ensureFile('packages/ai-hub/.env.example', AI_HUB_ENV_TEMPLATE, false);
ensureCopy('packages/ai-hub/.env.example', 'packages/ai-hub/.env');

ensureCopy('apps/web/.env.example', 'apps/web/.env');
ensureCopy('apps/api/.env.example', 'apps/api/.env');

console.log('\n✨ Workspace bootstrap and AI governance scaffolding completed successfully!');
console.log('👉 Next Steps:');
console.log('   1. Run "npm run setup" to verify dependencies and hoisted lockfile.');
console.log('   2. Run "npm run check" to verify typecheck and linting baseline.');
console.log('   3. Run "npm run dev" to boot the full-stack development servers.\n');
