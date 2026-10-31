# Universal AI Agent Governance

## 1. Operating Protocol
- **Plan First, Implement Second**: For any multi-file feature, generate a Task Requirement Document (TRD) and implementation strategy in `.ai/workflows/task-preparation.md` before writing code [4, 5].
- Check `.ai/agents/registry.json` and assume ONLY your assigned persona.

## 2. Boundaries & Separation of Concerns
- **Frontend (`apps/web`)**: Next.js App Router, React 19, Tailwind CSS v4, and Ant Design. Default to Server Components. Consume design tokens from `tokens.css`. Never import database clients or server secrets.
- **Backend (`apps/api`)**: Node.js API with Clean Architecture (`routes -> service -> repository`). Validate all inputs using `@workspace/contracts`.
- **Database Strategy**: Interact solely with `IRepository` port interfaces. Direct SQL/ORM usage is strictly restricted to `src/db/adapters/`.

## 3. Persistent Memory & Session Logs
- Always inspect `.ai/memory.md` before starting to avoid repeating past errors [6, 7].
- On task completion, append a markdown log to `.ai/sessions/YYYY-MM-DD-<task>.md` [6].
