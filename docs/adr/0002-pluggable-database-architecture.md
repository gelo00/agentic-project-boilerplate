# ADR 0002: Pluggable Database Architecture via Repository Port & Adapter Pattern

## Status
Accepted

## Context
The application backend requires persistent data storage. While PostgreSQL is the production engine, development workflows require offline in-memory execution and the ability to adapt to changing storage backends without altering business logic.

## Decision
We adopt the Hexagonal Ports & Adapters pattern in `apps/api`:
- Domain services interact solely with `I<Domain>Repository` interfaces.
- Concrete adapters (`PostgresUserRepository`, `InMemoryUserRepository`) reside in `src/db/adapters/`.
- A dynamic factory selects the adapter at runtime based on `DB_DRIVER`.
