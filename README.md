# 🚀 Agentic Full-Stack Monorepo Boilerplate

> A dual-audience, production-ready engineering boilerplate engineered for human developers and autonomous AI coding agents (VS Code, Copilot, Cursor, Claude Code, Antigravity).

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
- [Quick Start & One-Command Bootstrap](#-quick-start--one-command-bootstrap)
- [Database Configuration & Dynamic Switching](#-database-configuration--dynamic-switching)
- [Local Docker Stack & pgAdmin](#-local-docker-stack--pgadmin)
- [AI Governance & Agentic Workflows](#-ai-governance--agentic-workflows)
- [Engineering Standards & Specifications](#-engineering-standards--specifications)
- [Scripts & Quality Gates](#-scripts--quality-gates)

---

## 🏛 Overview & Architecture

This repository bridges high-rigor software engineering with modern AI agentic workflows. It is built around four foundational architectural principles:

1. **Dual-Audience Scaffolding**: Standardized documentation patterns ensure that human developers and autonomous coding models interpret requirements, constraints, and architecture through a single source of truth.
2. **Strict Type-Safe Contracts (`packages/contracts`)**: Shared Zod schemas and TypeScript types prevent schema drift between backend endpoints and frontend components.
3. **Pluggable Repository Pattern (`apps/api`)**: Dynamic data layer switching between an offline **In-Memory Store** (zero external dependencies) and **PostgreSQL** (Docker, native host, pgAdmin, or cloud-hosted instances like Neon and Supabase).
4. **Living Architectural Governance**: Integrated living specifications using **IEEE 830 / ISO/IEC/IEEE 29148 (SRS)**, **arc42 (Architecture)**, and **ADRs** to eliminate AI context drift.

---

## 📂 Repository Structure

```text
.
├── .ai/                            # AI Governance, subagents, and workflows
│   ├── agents/registry.json        # Subagent definitions (@planner, @fe-engineer, etc.)
│   ├── workflows/                  # Two-phase task execution pipelines
│   │   ├── task-preparation.md     # Phase 1: TRD & strategy drafting
│   │   └── task-execution.md       # Phase 2: Implementation & checklist tracking
│   └── memory.md                   # Working memory & session logging protocols
├── apps/
│   ├── web/                        # Next.js 16 + React 19 + Ant Design 5 + Tailwind 4
│   │   ├── src/
│   │   │   ├── app/                # App Router (layout, providers, pages)
│   │   │   ├── components/         # Reusable Ant Design UI wrappers
│   │   │   └── features/           # Modular vertical slices
│   │   └── package.json
│   └── api/                        # Pure Node.js 22 LTS API Service
│       ├── src/
│       │   ├── config/             # Zod environment variable validation
│       │   ├── db/                 # Factory pattern with pluggable repo adapters
│       │   │   ├── adapters/       # In-Memory vs. PostgreSQL implementations
│       │   │   └── factory.ts      # Runtime driver resolver
│       │   └── server.ts           # HTTP server and route handlers
│       ├── drizzle.config.ts       # Drizzle ORM configuration for PostgreSQL
│       └── package.json
├── packages/
│   └── contracts/                  # Shared Zod validation schemas & types
│       ├── src/
│       │   ├── auth.schema.ts      # Authentication contracts
│       │   └── index.ts            # Public barrel exports
│       └── package.json
├── docs/                           # Living software documentation
│   ├── srs.md                      # Software Requirements Specification (IEEE 830)
│   ├── architecture/               # arc42 modular architecture docs
│   └── adr/                        # Architecture Decision Records (MADR format)
├── scripts/
│   └── bootstrap.mjs               # Automated zero-friction onboarding script
├── docker-compose.yml              # Optional local PostgreSQL + pgAdmin service stack
├── knowledge/                      # Persistent task documentation (/trd.md, /progress.md)
├── AGENTS.md                       # Canonical AI coding rules & constraints
├── package.json                    # Root npm workspace configuration
└── tsconfig.base.json              # Shared TypeScript path aliases and compiler options