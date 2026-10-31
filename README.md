# 🚀 Agentic Full-Stack Monorepo Boilerplate

> A dual-audience, production-ready engineering boilerplate engineered for human developers and autonomous AI coding agents (VS Code, Copilot, Cursor, Claude Code, Antigravity) [1, 2, 14].

[![Node.js]([suspicious link removed])]([suspicious link removed])
[![Next.js]([suspicious link removed])]([suspicious link removed])
[![React]([suspicious link removed])]([suspicious link removed])
[![TypeScript]([suspicious link removed])]([suspicious link removed])
[![Tailwind CSS]([suspicious link removed])]([suspicious link removed])
[![Ant Design]([suspicious link removed])]([suspicious link removed])
[![License: MIT]([suspicious link removed])](LICENSE)

---

## 📖 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Repository Structure](#-repository-structure)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Database Configuration & Switching](#-database-configuration--switching)
- [AI Governance & Agentic Workflows](#-ai-governance--agentic-workflows)
- [Engineering Standards & Specifications](#-engineering-standards--specifications)
- [Scripts & Quality Gates](#-scripts--quality-gates)

---

## 🏛 Overview & Architecture

This repository bridges high-rigor software engineering with modern AI agentic workflows [1]. It is designed around four foundational architectural principles:

1. **Dual-Audience Scaffolding**: Standardized documentation patterns ensure that human developers and autonomous coding models interpret requirements, constraints, and architecture through a single source of truth [1, 2].
2. **Strict Type-Safe Contracts (`packages/contracts`)**: Shared Zod schemas and TypeScript types prevent schema drift between backend endpoints and frontend components.
3. **Pluggable Repository Pattern (`apps/api`)**: Dynamic data layer switching between an offline **In-Memory Store** (zero external dependencies) and **PostgreSQL** (Docker, native host, pgAdmin, or cloud-hosted instances like Neon and Supabase).
4. **Living Architectural Governance**: Integrated living specifications using **IEEE 830 / ISO/IEC/IEEE 29148 (SRS)** [7, 8], **arc42 (Architecture)** [8, 9], and **ADRs** [8, 15] to eliminate AI context drift [2, 16].

---

## 📂 Repository Structure

```text
.
├── .ai/                            # AI Governance, subagents, and workflows [10]
│   ├── agents/registry.json        # Subagent definitions (@planner, @fe-engineer, etc.)
│   ├── workflows/                  # Two-phase task execution pipelines [11-13]
│   │   ├── task-preparation.md     # Phase 1: TRD & strategy drafting [10, 12]
│   │   └── task-execution.md       # Phase 2: Implementation & checklist tracking [10, 13]
│   └── memory.md                   # Working memory & session logging protocols [10, 16, 17]
├── apps/
│   ├── web/                        # Next.js 16 + React 19 + Ant Design 5 + Tailwind 4 [3, 5, 6]
│   │   ├── src/
│   │   │   ├── app/                # App Router (layout, providers, pages) [5, 18]
│   │   │   ├── components/         # Reusable Ant Design UI wrappers [18]
│   │   │   └── features/           # Modular vertical slices [5, 19]
│   │   └── package.json
│   └── api/                        # Pure Node.js 22 LTS API Service [5]
│       ├── src/
│       │   ├── config/             # Zod environment variable validation
│       │   ├── db/                 # Factory pattern with pluggable repo adapters
│       │   │   ├── adapters/       # In-Memory vs. PostgreSQL implementations
│       │   │   └── factory.ts      # Runtime driver resolver
│       │   └── server.ts           # HTTP server and route handlers
│       └── package.json
├── packages/
│   └── contracts/                  # Shared Zod validation schemas & types
│       ├── src/
│       │   ├── auth.schema.ts      # Authentication contracts
│       │   └── index.ts            # Public barrel exports
│       └── package.json
├── docs/                           # Living software documentation
│   ├── srs.md                      # Software Requirements Specification (IEEE 830) [7, 8]
│   ├── architecture/               # arc42 modular architecture docs [8, 9]
│   └── adr/                        # Architecture Decision Records (MADR format) [8, 20]
├── knowledge/                      # Persistent task documentation (/trd.md, /progress.md) [12, 13]
├── AGENTS.md                       # Canonical AI coding rules & constraints [21-23]
├── package.json                    # Root npm workspace configuration
└── tsconfig.base.json     