# Architecture Documentation (arc42)

## 1. Introduction & Goals
High-performance web architecture supporting autonomous agentic coding workflows [3].

## 3. Context & Scope
- **Client**: Browser rendering Next.js Server & Client components [3].
- **Server**: Node.js API managing business logic and database persistence.
- **Boundary**: Shared Zod schemas in `@workspace/contracts`.

## 5. Building Block View
- `apps/web`: App Router, layout slots, Ant Design widgets, Tailwind styling [3].
- `apps/api`: Route controllers, domain services, database adapters [3].
- `packages/contracts`: Single source of truth for schemas and response models.

## 8. Crosscutting Concepts
- **Design Tokens**: Defined in `apps/web/src/app/styles/tokens.css` [3, 9].
- **Pluggable Persistence**: Port & Adapter pattern dynamically toggled via `DB_DRIVER` [3].

## 9. Architectural Decisions
- `docs/adr/0001-use-monorepo-separation.md`
- `docs/adr/0002-pluggable-database-architecture.md`
