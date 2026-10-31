# arc42 Section 3: Context and Scope

## 1. Business Context
```text
[ Browser / User ] ──► [ apps/web (Port 3000) ]
                              │
                              ▼ (HTTP / JSON via @workspace/contracts)
                        [ apps/api (Port 4000) ]
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
     [ Pluggable DB Layer ]        [ packages/ai-hub ]
      (Memory / PostgreSQL)         (Ollama / Claude / OpenAI)