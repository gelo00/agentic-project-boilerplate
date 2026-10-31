Master Repository README & Agentic Full-Stack Repository Guide

1. Executive Overview & Dual-Audience Paradigm

Context & Strategic Importance

Modern production software engineering demands a foundational architecture shift: treating autonomous AI agents (such as Claude Code, Cursor, Codex, and OpenClaw) and human engineers as equal, first-class consumers of codebase context, architectural guardrails, and repository instructions. Traditional repositories rely on implicit institutional knowledge, informal peer reviews, and organic visual hierarchies. In contrast, dual-audience repository architecture embeds machine-interpretable metadata, explicit operational boundaries, and deterministic quality gates alongside human-readable specifications. By establishing continuous context parity, this paradigm eliminates operational ambiguity, prevents structural decay during automated multi-turn editing sessions, and ensures that human developers and AI swarms enforce identical system invariants.

Dual-Audience Engineering Philosophy

Conventional developer documentation prioritizes human intuition—focusing on broad visual overviews and quick start summaries. Autonomous AI agent design demands structured, machine-parsable standards such as universal AGENTS.md specifications, .aigx/ per-file boundary definitions, and modular .cursor/rules/*.mdc rule declarations.

CRITICAL ARCHITECTURAL WARNING: Legacy single-file .cursorrules configurations are silently ignored in Cursor's Agent mode. Monorepo governance requires strict migration to scoped .cursor/rules/*.mdc Markdown-with-frontmatter files to ensure rule injection into agent reasoning contexts.

Integrating persistent repository-native context directly neutralizes the four primary structural failure modes of agentic development:

* Stateless Inference: Overcomes the epochal freeze of pre-trained LLM weights and stateless session resets by injecting persistent, version-controlled repository state directly into the prompt assembly.
* Context Poisoning: Prevents compound failure loops caused by stale tool outputs, outdated memory entries, or hallucinated intermediate code generation by validating artifacts against deterministic guardrails.
* System Prompt Decay: Eliminates instruction erosion across extended multi-turn interactions by anchoring agent attention to modular spec files throughout execution.
* Self-Conditioning Errors: Halts feedback loops where an agent misinterprets its own prior unverified edits or syntactic mistakes as canonical repository patterns.

Human Developer Needs	Autonomous AI Agent Needs
Fast setup instructions and visual architectural overviews	Strict tool access boundaries and non-bypassable pre-tool hooks
Clean, domain-intuitive file hierarchies and directory layout	Deterministic schema contracts and unambiguous relative path declarations
High-level architectural diagrams and design rationale	Machine-readable ID traceability and strict type signature rules
Concise API summaries and interactive code samples	Machine-verifiable quality gates (linters, static analyzers, test runners)

Core Stack & Architecture Matrix

Layer	Technology	Version	Strategic Operational Purpose
Runtime Environment	Node.js	22 LTS (22.12+)	Enterprise server-side JavaScript execution runtime
Build System	Vite	6.0	High-performance build bundler and hyper-fast HMR dev server
Frontend Framework	React	19 (19.3+)	Concurrent component hierarchy and Server Component support
Styling Engine	Tailwind CSS	4.0	Utility-first CSS engine driven by dynamic CSS design tokens
UI Primitive Libraries	Ant Design & shadcn/ui	5.x / Modern	Enterprise UI primitives paired with accessible headless components
Persistence Layer	PostgreSQL & Drizzle ORM	Latest	Type-safe relational data modeling and schema migration engine
Living Specifications	IEEE 830 & arc42	Standardized	Formally structured requirement specs and architectural documentation

Systematically pairing utility-first styling (Tailwind CSS 4) with enterprise component libraries (Ant Design 5 and shadcn/ui primitives) addresses a central challenge in AI-assisted frontend workflows. Enterprise libraries provide battle-tested accessibility trees and complex interaction patterns out of the box, but agents frequently attempt to override internal vendor styles with fragile wrapper logic. By surfacing CSS design tokens directly (src/app/styles/tokens.css) and binding them to Tailwind utilities, the monorepo provides agents with a clean abstraction layer. Agents are instructed to reuse primitive components and modify visual layouts using standardized design tokens rather than injecting inline styles or constructing duplicate UI primitives.

The following section maps the physical layout and topological structure of the monorepo workspace.

2. Monorepo Workspace & Architectural Topology

Context & Strategic Importance

To preserve context fidelity across complex multi-file tasks, this monorepo adopts a feature-based vertical slice directory topology. Modularizing code boundaries by business domain isolates data models, API handlers, UI components, and test suites. This structural isolation minimizes context bloat and lowers the Maximum Effective Context Window (MECW) load, allowing agents to focus attention on the specific domain slice under development without ingesting irrelevant workspace state.

Directory Structure & Artifact Mapping

monorepo-root/
├── .ai/                            # [Agent] AI Agent Working Memory & Workflow System
│   ├── memory.md                   # Long-lived repository memory index
│   ├── sessions/                   # Timestamped session logs ({yyyy-mm-dd}-{title}.md)
│   └── tools/                      # Reusable agentic execution protocols
│       ├── task-preparation-workflow.md
│       └── implementation-workflow.md
├── .claude/                        # [Agent] Claude Code Configuration & Skills
│   ├── CLAUDE.md                   # Primary Claude entrypoint and workspace instructions
│   ├── settings.json               # Security permissions & hook configurations
│   ├── hooks/                      # PreToolUse & PermissionRequest shell scripts
│   ├── commands/                   # Workspace slash-command aliases
│   └── skills/                     # Domain skill registries (loaded dynamically)
├── .cursor/                        # [Agent] Cursor IDE Governance Layer
│   └── rules/                      # Scoped MDC rules (*.mdc Markdown-with-frontmatter)
├── config/                         # [Dual] Centralized Tooling Configuration
│   ├── vitest.config.ts            # Unit and component test runner configuration
│   ├── playwright.config.ts        # End-to-end browser automation setup
│   ├── oxlint.json                 # Fast static analysis linter rules
│   ├── oxfmt.json                  # Formatter and class-sorting rules
│   └── knip.json                   # Dead code and unlisted dependency auditor
├── docs/                           # [Dual] Living Architectural Specifications
│   ├── srs.md                      # IEEE 830 Requirements Specification
│   ├── architecture/               # arc42 Architecture Documentation (Sections 1-12)
│   └── adr/                        # Architecture Decision Records (MADR format)
├── src/                            # [Dual] Application Source Code Workspace
│   ├── app/                        # App router entry points, page routes, and global styles
│   ├── components/                 # Shared UI primitives (shadcn/ui & Ant Design)
│   ├── features/                   # Domain Vertical Slices (Feature Modules)
│   │   ├── auth/                   # Authentication slice (BetterAuth, RBAC rules)
│   │   ├── i18n/                   # Internationalization slice (next-intl configs)
│   │   └── site/                   # Site metadata and global settings slice
│   └── libs/                       # Core drivers (T3 Env validation, DB connection pool)
├── AGENTS.md                       # [Dual] Universal multi-harness repository rulebook
└── package.json                    # [Dual] Monorepo dependencies and workspace scripts


The directories within this workspace serve distinct operational purposes across human and agent workflows:

* src/app/ & src/features/: Domain-driven feature slices containing business logic, React components, state models, and routes. Engineers locate domain code by feature name; agents restrict file traversal to specific slices to conserve token context.
* src/components/ & src/libs/: Shared infrastructural primitives. Agents consume these as immutable components rather than re-implementing layout controls or environment parsers.
* .ai/: Working memory files and workflow protocols. Autonomous agents maintain session logs and checklist states here under prompt guidance.
* .claude/ & .cursor/rules/: IDE-specific rules. Files like CLAUDE.md and .cursor/rules/*.mdc provide persistent instructions automatically injected into agent context windows.
* docs/: The authoritative source of truth for requirements, architectural decisions, and module specs. Human architects manage these documents; agents inspect them to validate planned modifications against system invariants.
* config/: Tool configurations governing static analysis, test execution, and code formatting.

Living Architectural Specifications Framework (IEEE 830 & arc42)

System governance is anchored by a living specification framework combining the IEEE 830 Software Requirements Specification (SRS) standard with the arc42 Software Architecture Documentation model.

Before proposing or editing source code, agents consult the 12 arc42 architectural modules in docs/architecture/ as immutable system boundaries:

1. Introduction & Goals: Business context, target deliverables, and top-level quality objectives.
2. Constraints: Technical infrastructure, regulatory boundaries, and language constraints.
3. Context & Scope: System scope, external interfaces, and boundary conditions.
4. Solution Strategy: Core technical decisions and foundational architectural choices.
5. Building Block View: Static decomposition of code modules, feature slices, and component structures.
6. Runtime View: Sequence flows, execution patterns, and cross-slice interaction models.
7. Deployment View: Physical runtime topology, container specs, and environment delivery models.
8. Crosscutting Concepts: Enterprise patterns for security, error handling, logging, and state mapping.
9. Architectural Decisions: Structured Architecture Decision Records (ADRs) recorded in MADR format.
10. Quality Requirements: Detailed quality trees and concrete validation scenarios.
11. Risks & Technical Debt: Known system trade-offs, technical debt, and risk mitigations.
12. Glossary: Domain terms mapping domain concepts directly to code interfaces.

To enforce accountability, the repository implements a strict ID Traceability Schema. Every requirement, architectural change, code module, and test case must link through a continuous chain:

* Requirement ID: REQ-001 (Formally declared in docs/srs.md per IEEE 830)
* Architectural Decision: ADR-001 (Documented in docs/adr/ per MADR standard)
* Technical Specification: SPEC-001 (Defined in docs/architecture/ Building Block View)
* Verification Gate: TEST-001 (Implemented in unit, integration, or end-to-end test suites)

Having established the repository topology and specification framework, Section 3 details the agent memory system and workflow infrastructure.

3. Agentic Memory, Context, and Workflow Infrastructure

Context & Strategic Importance

Unstructured chat interactions break down when applied to complex multi-file refactoring tasks. As sessions progress, LLMs experience context drift (the subtle loss of alignment with initial intent) and risk context poisoning (the accumulation of invalid intermediate tool outputs or hallucinated paths). Repository-native context engineering addresses these challenges using tiered memory structures, token optimization controls, and structured execution workflows.

Token efficiency is critical for maintaining high reasoning accuracy. Agents must utilize proactive session management commands in Claude Code:

* /clear: Resets the active context window completely between unrelated subtasks.
* /compact: Compresses verbose session histories into a minimal context summary while preserving key execution decisions.

For browser automation, using CLI-based execution frameworks yields significant token savings over heavy Model Context Protocol (MCP) server wrappers. Invoking @playwright/cli directly consumes approximately ~27k tokens per scenario—compared to ~114k tokens when using traditional browser MCP wrappers—representing a 4× reduction in token usage while preserving execution control.

System Memory Architecture & Tiers

+-------------------------------------------------------------------------+
| Tier 1: Working Context (Active LLM Context Window & Ephemeral Tools)   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Tier 2: Durable Session Memory (.ai/sessions/{yyyy-mm-dd}-{title}.md)   |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Tier 3: Long-Lived Repository Memory (.ai/memory.md & AGENTS.md)        |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Tier 4: Named Artifacts (docs/srs.md & docs/architecture/*.md)          |
+-------------------------------------------------------------------------+


1. Tier 1: Working Context: The active prompt window holding current instructions, targeted file selections, and real-time command responses.
2. Tier 2: Durable Session Memory: Dated records stored in .ai/sessions/{yyyy-mm-dd}-{title}.md. Every major task session logs its objective, history summary, concrete code outcomes, and resolution notes.
3. Tier 3: Long-Lived Repository Memory: The central index in .ai/memory.md and AGENTS.md. Captures system patterns, persistent gotchas, data constraints, and workspace setup rules.
4. Tier 4: Named Artifacts: Version-controlled architectural specifications (SRS, arc42 documentation, ADRs) referenced directly by relative path.

Memory Maintenance Rules for .ai/memory.md

To maintain memory hygiene and prevent context degradation, agents must enforce these operational rules:

* Mitigation of Context Drift: Re-anchor execution to docs/srs.md requirements at the beginning of each session. Prune conversational drift from .ai/memory.md so that only verified architectural decisions persist.
* Mitigation of Context Poisoning: Mask or strip failed command traces, invalid stack dumps, and deprecated paths from memory logs. Log only successful, verified implementation patterns.
* Concise Architectural Logging: Record only structural changes, new infrastructure dependencies, or critical interface updates. Exclude routine code edits.
* Immediate Specification Alignment: When a subtask modifies system boundaries or introduces new packages, update .ai/memory.md and the corresponding arc42 specifications immediately.

Two-Phase Reusable Workflow Protocol

+-------------------------------------------------------------------------+
| PHASE 1: TASK PREPARATION (.ai/tools/task-preparation-workflow.md)      |
|  1. Scaffold task folder: .ai/knowledge/{feature}/                      |
|  2. Draft Task Requirement Document (trd.md)                            |
|  3. Formulate Implementation Strategy (implementation-strategy.md)     |
|  4. Initialize Subtask Checklist (progress.md)                          |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| PHASE 2: TASK EXECUTION (.ai/tools/implementation-workflow.md)          |
|  1. Read implementation-strategy.md & fetch pending subtask             |
|  2. Apply targeted code modifications incrementally                     |
|  3. Run deterministic verification gates (typecheck, lint, test)         |
|  4. Mark subtask complete in progress.md & iterate until done          |
+-------------------------------------------------------------------------+


Phase 1: Task Preparation Protocol

Before generating feature code, agents execute .ai/tools/task-preparation-workflow.md:

1. Scaffold a isolated task workspace: .ai/knowledge/{feature_name}/.
2. Author trd.md (Task Requirement Document) detailing user stories, acceptance criteria, and system dependencies.
3. Author implementation-strategy.md outlining proposed schema updates, API routes, UI components, and test strategies.
4. Generate progress.md containing a granular checklist of executable subtasks.

Phase 2: Task Execution Protocol

Upon strategy validation, agents execute .ai/tools/implementation-workflow.md:

1. Inspect implementation-strategy.md and read the next pending task in progress.md.
2. Perform isolated code modifications restricted to that single subtask.
3. Execute local verification scripts (npm run typecheck, npm run lint, npm run test).
4. Update progress.md to mark the subtask complete, repeating the cycle until all tasks pass validation.

Deterministic Security Guardrails & Tool Hooks

Security boundaries must be enforced deterministically at the execution layer rather than relying on LLM compliance.

Claude Code Guardrails (PreToolUse & PermissionRequest)

Claude Code security configuration is managed in .claude/settings.json, leveraging both PreToolUse and PermissionRequest hooks:

{
  "permissions": {
    "deny": [
      "./.env",
      "./.env.*",
      "!./.env.example",
      "./secrets/**",
      "./.aws/credentials",
      "config/root-secrets.json"
    ]
  },
  "hooks": {
    "PreToolUse": ".claude/hooks/pre-tool-use.sh",
    "PermissionRequest": ".claude/hooks/permission-request.sh"
  }
}


The PreToolUse shell script inspects incoming tool execution paths. Attempts to alter protected paths fail immediately with a non-zero exit code:

#!/usr/bin/env bash
# .claude/hooks/pre-tool-use.sh
# Deterministic pre-execution gate blocking unauthorized file access

TARGET_PATH="$CLAUDE_TOOL_INPUT_PATH"

case "$TARGET_PATH" in
  ./.env*|./secrets/*|./.aws/*|config/root-secrets.json)
    echo "SECURITY POLICY VIOLATION: Execution blocked. Edits to '$TARGET_PATH' are forbidden." >&2
    exit 1
    ;;
  *)
    exit 0
    ;;
esac


The PermissionRequest hook evaluates systemic invocation requests, automatically denying unauthorized tool calls or shell commands that target restricted directories:

#!/usr/bin/env bash
# .claude/hooks/permission-request.sh
# Automated permission evaluator for system tool execution

REQUEST_PAYLOAD="$CLAUDE_PERMISSION_REQUEST_CMD"

if echo "$REQUEST_PAYLOAD" | grep -qE "(rm -rf /|drop database|secrets|/.aws)"; then
  echo "PERMISSION DENIED: Destructive or unauthorized system command blocked." >&2
  exit 1
fi

exit 0


File Ingestion Exclusions (.cursorignore)

Exclusions are declared in .cursorignore to prevent sensitive workspace assets from entering agent search indexes:

# .cursorignore - Environment and Secret Exclusion Mask
.env
.env.*
!.env.example
secrets/**
.aws/**
docs/internal/private-keys.pem


Section 4 details the repository's Git workflow standards, swarm topologies, and commit controls.

4. Comprehensive Git & Repository Workflow Guide

Context & Strategic Importance

In an agentic engineering environment, Git serves as both a version control system for human collaboration and an immutable audit trail for autonomous agent actions. Standardizing worktree isolation, commit structures, and automated hook gates ensures clear provenance tracking for all automated changes.

Branching Strategy & Isolated Agent Swarms

Feature work occurs on dedicated branches using standard naming patterns: feat/{feature-name}, fix/{bug-name}, or chore/{task-name}.

For complex tasks spanning multiple modules, the repository uses Git Worktrees to execute isolated agent swarms in parallel without workspace conflicts:

                        +----------------------------+
                        |   Coordinator Agent        |
                        |   (Main Workspace Tree)    |
                        +-------------+--------------+
                                      |
            +-------------------------+-------------------------+
            |                                                   |
            v                                                   v
+-----------------------+                           +-----------------------+
|  Implementor Swarm A  |                           |  Implementor Swarm B  |
|  (Worktree: /ui-slice)|                           |  (Worktree: /api-slice|
+-----------+-----------+                           +-----------+-----------+
            |                                                   |
            +-------------------------+-------------------------+
                                      |
                                      v
                        +----------------------------+
                        |   Verifier Agent           |
                        |   (Runs Tests against SRS) |
                        +----------------------------+


Under this Coordinator-Implementor-Verifier topology:

* Coordinator Agent: Parses top-level REQ-xxx specifications, partitions work into discrete domains, and provisions isolated git worktrees (git worktree add .worktrees/ui feat/ui-slice).
* Implementor Swarms: Specialist agents work concurrently within isolated worktree directories, eliminating uncommitted file conflicts in the main workspace.
* Verifier Agent: Inspects merged worktree diffs, executing npm run check and running automated test suites against docs/srs.md requirements prior to submitting pull requests for human review.

Conventional Commit Conventions & Provenance Signing

Commits must conform to the Conventional Commit specification (<type>(<scope>): <subject>). Allowed types and repository-specific examples include:

1. feat (New Feature)

feat(auth): add BetterAuth OAuth2 provider integration

Implements Google and GitHub authentication handlers under src/features/auth.

Traceability: REQ-012 -> ADR-004 -> SPEC-018 -> TEST-045
Model Tier: Anthropic Claude Sonnet 5.5 High
Skill ID: auth_oauth_provider_v1
Verification Execution: Vitest (PASS: 12/12), Oxlint (PASS)

Signed-off-by: Autonomous Implementor Agent <agent-swarm-node-01@internal>


2. fix (Defect Resolution)

fix(i18n): resolve cookie resolution fallback on initial page render

Ensures NEXT_LOCALE cookie defaults to 'en' when headers are missing.

Traceability: REQ-005 -> ADR-002 -> SPEC-009 -> TEST-022
Model Tier: Anthropic Claude Sonnet 5.5 High
Skill ID: i18n_cookie_resolver_v1
Verification Execution: Vitest (PASS: 4/4), Playwright (PASS: 2/2)

Signed-off-by: Autonomous Implementor Agent <agent-swarm-node-02@internal>


3. docs (Documentation Updates)

docs(architecture): update arc42 Building Block View for Drizzle schema

Adds entity relationship details for user sessions and permission tables.

Traceability: REQ-001 -> ADR-001 -> SPEC-003 -> TEST-N/A
Model Tier: Anthropic Claude Opus 5.5 Medium
Skill ID: docs_arc42_architect_v1
Verification Execution: Oxfmt (PASS)

Signed-off-by: Autonomous Implementor Agent <agent-swarm-node-03@internal>


4. refactor (Structural Refactoring)

refactor(ui): extract table pagination primitive into shared component

Moves reusable pagination controls from src/features/site to src/components/ui.

Traceability: REQ-030 -> ADR-008 -> SPEC-024 -> TEST-051
Model Tier: Cursor Composer 2.5 Fast
Skill ID: ui_component_refactor_v2
Verification Execution: Oxlint (PASS), Vitest (PASS: 18/18)

Signed-off-by: Autonomous Implementor Agent <agent-swarm-node-04@internal>


5. test (Test Suite Additions)

test(env): add T3 Env validation tests for missing secrets

Adds Vitest test scenarios covering invalid DATABASE_URL formats.

Traceability: REQ-004 -> ADR-003 -> SPEC-007 -> TEST-015
Model Tier: Anthropic Claude Sonnet 5.5 High
Skill ID: testing_unit_generator_v1
Verification Execution: Vitest (PASS: 8/8)

Signed-off-by: Autonomous Implementor Agent <agent-swarm-node-01@internal>


6. chore (Maintenance & Dependencies)

chore(config): update Oxlint and Oxfmt workspace rule definitions

Enforces stricter Tailwind CSS class sorting across src/components.

Traceability: REQ-002 -> ADR-001 -> SPEC-002 -> TEST-N/A
Model Tier: Anthropic Claude Fable 5.1 High
Skill ID: chore_linter_updater_v1
Verification Execution: Oxlint (PASS), Oxfmt (PASS)

Signed-off-by: Autonomous Implementor Agent <agent-swarm-node-05@internal>


Automated Quality Hooks & Pre-Commit/Pre-Push Gates

Quality gates are enforced locally via Lefthook:

# lefthook.yml - Repository Quality Gate Hooks Configuration
pre-commit:
  parallel: true
  commands:
    detect-secrets:
      run: detect-secrets-hook --staged {staged_files}
    oxlint:
      run: npx oxlint --staged
    oxfmt:
      run: npx oxfmt --check {staged_files}
    typecheck:
      run: npm run typecheck

pre-push:
  commands:
    full-ci-check:
      run: npm run check


* Pre-Commit Gate: Executes detect-secrets to prevent credential leaks, runs oxlint and oxfmt for static analysis and class sorting, and runs tsc --noEmit to verify type safety across staged files.
* Pre-Push Gate: Executes npm run check (typecheck + lint + knip + test) to validate overall system integrity before pushing to remote branches.

Bypassing hooks via git commit --no-verify is strictly forbidden by repository policy. Unverified commits will fail downstream CI pipelines.

Section 5 provides command references for environment bootstrapping, workspace maintenance, and release verification.

5. Quickstart, Maintenance Operations & Verification Gates

Context & Strategic Importance

Deterministic setup scripts and validation checks ensure reliable environment setup for developers and clear terminal execution workflows for AI agents. Zero-trust environment validation detects missing configuration parameters prior to application startup.

One-Command Provisioning & Environment Setup

Execute the following commands in a Node.js 22 LTS environment to clone, initialize, validate, and launch the workspace:

# 1. Clone workspace repository and navigate to root directory
git clone https://github.com/organization/monorepo-workspace.git
cd monorepo-workspace

# 2. Install workspace dependencies using pinned package manifest
npm ci

# 3. Replicate environment variable configuration template
cp .env.example .env

# 4. Launch local development server
npm run dev


Upon successful boot, the local application environment will be available at http://localhost:6767.

Server-Side Environment Validation

Runtime parameters are validated on startup using T3 Env in src/libs/env.ts. Missing required secrets (such as BETTER_AUTH_SECRET or DATABASE_URL) will halt process execution and output diagnostic logs:

// src/libs/env.ts - T3 Env Environment Variable Validation Schema
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(32),
    AUTH_ADMIN_EMAILS: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_DEMO_MODE: z.string().transform((v) => v === "true"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    AUTH_ADMIN_EMAILS: process.env.AUTH_ADMIN_EMAILS,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  },
});


Cache Management, Clean Slate Protocols & Emergency Reset

Command	Operational Effect
npm run dev	Boots local development server at http://localhost:6767.
npm run build	Compiles production assets and generates standalone build artifacts.
npm run demo:remove	Executes scripts/remove-demo.mjs, purging demo assets under src/_demo(DELETE)/.
npm run knip	Scans workspace for unlinked files, unused exports, and dangling dependencies.
npm run format:fix	Executes oxfmt --fix to format code and auto-sort utility CSS classes.

Emergency Workspace Reset Protocol

If a session experiences workspace corruption or persistent uncommitted errors, execute this reset sequence to restore the repository to a clean state:

# Emergency Workspace Reset Sequence
git status
git restore .
git clean -fd
rm -rf node_modules .venv .vite
npm ci


Comprehensive Verification Matrix & Release Readiness

Tool	CLI Verification Command	Target Scope	Mandatory Pass Criteria
TypeScript 7	npm run typecheck	Workspace TypeScript files	Zero compiler errors (tsc --noEmit)
Oxlint & Oxfmt	npm run lint
npm run format:check	src/ codebase files	Zero lint errors; formatting fully compliant
Knip Hygiene	npm run knip	Full monorepo dependency graph	Zero unused files, unused exports, or unlisted deps
Vitest	npm run test	Unit and component specs in src/tests/	100% test suite pass execution
Playwright	npm run e2e	End-to-end browser workflows	All test scenarios pass against port 6767
Metrics Verification	npm run verify:metrics	Auto-generated document indexes	All README counters, badges, and metrics synchronized

Definition of Done Checklist

Before submitting a pull request or marking an agentic task complete, confirm that all checklist items are satisfied:

* [ ] Traceability Confirmed: Every modified file links to a valid REQ-xxx entry in docs/srs.md and an ADR-xxx entry in docs/adr/.
* [ ] Verification Matrix Passed: npm run check (typecheck + lint + knip + test) completes with zero errors.
* [ ] E2E Browser Validation Green: npm run e2e completes successfully using Playwright against port 6767.
* [ ] Agent Memory & Metrics Synced: Session outcomes are logged in .ai/sessions/, persistent rules updated in .ai/memory.md, and npm run verify:metrics executed.
* [ ] Provenance & Commit Formatting Complete: Commit messages follow Conventional Commit specs and include agent provenance metadata and sign-off signatures.
