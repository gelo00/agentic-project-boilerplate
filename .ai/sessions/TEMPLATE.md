# Session: [YYYY-MM-DD] - <Task Name>

- **Agent / Tool**: GitHub Copilot | Antigravity | CLI Agent
- **Persona Assumed**: Principal Frontend Engineer | Principal Backend Engineer
- **Status**: Completed | In Progress | Blocked

## 1. Intent & Specs Consulted
- Living specs: `docs/specs/srs/` or `docs/specs/arc42/`
- Prior context: `.ai/memory.md`

## 2. Changes Executed
- Modified / Created files:
  - `apps/...`
  - `packages/...`

## 3. Verification & OWASP Checks
- [ ] Executed `npm run check` (typecheck + lint passed with 0 errors)
- [ ] Zod schema validation applied (`@workspace/contracts`)
- [ ] Parameterized database queries verified (Drizzle ORM)
- [ ] Client XSS defenses verified (zero `dangerouslySetInnerHTML`)

## 4. Learnings & Memory Updates
- Any discovered pattern appended to `.ai/memory.md`
