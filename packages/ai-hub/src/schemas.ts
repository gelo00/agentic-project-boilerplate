import { z } from "zod"

// ==============================================================================
// 1. Roles & Chat Message Schema (OWASP LLM01 & LLM04 Defense)
// ==============================================================================
export const ChatRoleSchema = z.enum(["system", "user", "assistant"])

export const ChatMessageSchema = z
  .object({
    role: ChatRoleSchema,
    content: z
      .string()
      .trim()
      .min(1, "Message content cannot be empty")
      .max(
        10000,
        "Single message exceeds maximum character cap (10,000 chars)",
      ),
  })
  .strict()

// ==============================================================================
// 2. Profile & Prompt Key Enums
// ==============================================================================
export const AIProfileSchema = z.enum([
  "default", // Local Ollama instance (offline/dev)
  "fast", // Low-latency cloud inference (Claude 3.5 Haiku / GPT-4o-mini)
  "smart", // Complex reasoning and architecture (Claude 3.5 Sonnet / GPT-4o)
  "gemini", // Google Gemini (1.5 Flash / Pro)
  "mock", // Deterministic mock responses for CI unit tests
])

export const AIPromptKeySchema = z.enum([
  "assistant",
  "codeReviewer",
  "summarizer",
  "securityAuditor",
])

// ==============================================================================
// 3. Generation Request Schema
// ==============================================================================
export const GenerateRequestSchema = z
  .object({
    messages: z
      .array(ChatMessageSchema)
      .min(1, "At least one message is required")
      .max(
        50,
        "Conversation history exceeds maximum payload window (50 messages)",
      ),
    promptKey: AIPromptKeySchema.optional().default("assistant"),
    profileOverride: AIProfileSchema.optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().int().positive().max(8192).optional(),
  })
  .strict()

// ==============================================================================
// 4. Token Usage & Error Envelopes (OWASP A05 / LLM06)
// ==============================================================================
export const TokenUsageSchema = z
  .object({
    promptTokens: z.number().nonnegative().optional(),
    completionTokens: z.number().nonnegative().optional(),
    totalTokens: z.number().nonnegative().optional(),
  })
  .strict()

export const AIErrorSchema = z
  .object({
    message: z.string(),
    code: z.enum([
      "RATE_LIMIT_EXCEEDED",
      "TIMEOUT",
      "PROVIDER_UNAVAILABLE",
      "CONTEXT_LENGTH_EXCEEDED",
      "VALIDATION_FAILED",
      "INTERNAL_ERROR",
    ]),
  })
  .strict()

// ==============================================================================
// 5. Generation Response Schema
// ==============================================================================
export const GenerateResponseSchema = z
  .object({
    success: z.boolean(),
    content: z.string(),
    model: z.string(),
    provider: z.string(),
    usage: TokenUsageSchema.optional(),
    error: AIErrorSchema.optional(),
  })
  .strict()

// ==============================================================================
// 6. Inferred TypeScript Types
// ==============================================================================
export type ChatRole = z.infer<typeof ChatRoleSchema>
export type ChatMessage = z.infer<typeof ChatMessageSchema>
export type AIProfile = z.infer<typeof AIProfileSchema>
export type AIPromptKey = z.infer<typeof AIPromptKeySchema>
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>
export type TokenUsage = z.infer<typeof TokenUsageSchema>
export type AIError = z.infer<typeof AIErrorSchema>
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>
