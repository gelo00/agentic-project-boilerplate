# AI Hub

`@workspace/ai-hub` is the centralized runtime package for AI model routing, prompt templates, strict request/response validation, and provider-specific dispatch behavior.

Application code should import the AI Hub through `@workspace/ai-hub` rather than calling provider SDKs directly.

## Usage

```ts
import { aiHub } from '@workspace/ai-hub';

const response = await aiHub.generate({
  promptKey: 'assistant',
  messages: [
    {
      role: 'user',
      content: 'Summarize the repository architecture.',
    },
  ],
});
```

Use `profileOverride` to select a routing profile for an individual request:

```ts
const response = await aiHub.generate({
  promptKey: 'summarizer',
  profileOverride: 'smart',
  messages: [{ role: 'user', content: 'Summarize these changes.' }],
});
```

## Profiles

| Profile | Current behavior | Default provider |
| --- | --- | --- |
| `default` | Local development dispatcher | Ollama |
| `fast` | Low-latency cloud dispatcher | OpenAI or Anthropic-compatible selection |
| `smart` | Complex reasoning cloud dispatcher | OpenAI or Anthropic-compatible selection |
| `gemini` | Google Gemini dispatcher | Gemini |
| `mock` | Deterministic response for local tests and CI | Mock |

The cloud and Gemini adapters in the current implementation are deterministic placeholders. Provider endpoint definitions are centralized, but live network calls must be added through the AI Hub instead of application-level SDK integrations.

## Prompts

`SYSTEM_PROMPTS` contains named prompts for:

- `assistant`
- `codeReviewer`
- `summarizer`
- `securityAuditor`

`buildPromptMessages()` prepends the selected system prompt and removes any system messages supplied by untrusted input before dispatch.

## Validation and Guardrails

The package uses strict Zod schemas for:

- Chat roles and message contents
- Generation profiles and prompt keys
- Generation requests and responses
- Token usage
- Categorized error responses

The client:

- Rejects unknown object properties through `.strict()` schemas
- Limits each message to 10,000 characters
- Limits conversation history to 50 messages
- Limits total input using `AI_MAX_INPUT_CHARS`
- Wraps inference dispatch with `AI_TIMEOUT_MS`
- Returns masked, categorized errors instead of exposing internal exception details

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `AI_ACTIVE_PROFILE` | `default` | Active profile used when a request does not override it |
| `AI_PROFILE_DEFAULT` | `ollama` | Provider target for the default profile |
| `AI_PROFILE_FAST` | `groq` | Provider target for the fast profile |
| `AI_PROFILE_SMART` | `gemini` | Provider target for the smart profile |
| `AI_TIMEOUT_MS` | `30000` | Inference timeout |
| `AI_MAX_RETRIES` | `2` | Retry configuration bound |
| `AI_MAX_INPUT_CHARS` | `10000` | Maximum combined request character count |
| `OLLAMA_BASE_URL` | `http://localhost:11434/v1` | Local Ollama OpenAI-compatible base URL |
| `GROQ_API_KEY` | unset | Groq provider credential |
| `GEMINI_API_KEY` | unset | Gemini provider credential |
| `ANTHROPIC_API_KEY` | unset | Anthropic provider credential |
| `OPENAI_API_KEY` | unset | OpenAI provider credential |

Cloud provider entries fall back to the mock provider when a required API key is unavailable. The Ollama entry is local and does not require an API key.

## API Surface

```ts
export { AIHubClient, aiHub };
export { aiConfig, loadAIConfig, AI_PROVIDERS, getActiveProvider };
export { buildPromptMessages, SYSTEM_PROMPTS };
export {
  GenerateRequestSchema,
  GenerateResponseSchema,
  ChatMessageSchema,
  AIProfileSchema,
  AIPromptKeySchema,
};
```

## Source Layout

- `config.ts` - environment loading, provider registry, and profile routing
- `client.ts` - request validation, guardrails, dispatch, timeout, and error envelopes
- `prompts.ts` - system prompt registry and prompt assembly
- `schemas.ts` - strict Zod contracts and inferred TypeScript types
- `index.ts` - package barrel exports
