import { AIProfile, AIProfileSchema } from "./schemas.js"

export interface ProviderEndpoint {
  name: string
  baseUrl: string
  apiKey?: string
  defaultModel: string
}

export interface AIHubConfig {
  activeProfile: AIProfile
  // Free & Cloud Provider Keys
  groqApiKey?: string
  geminiApiKey?: string
  anthropicApiKey?: string
  openaiApiKey?: string
  // Local Provider Endpoints
  ollamaBaseUrl: string
  // Guardrails & Resilience Bounds
  timeoutMs: number
  maxRetries: number
  maxInputChars: number
}

/**
 * Loads and validates runtime configuration from environment variables.
 */
export function loadAIConfig(): AIHubConfig {
  const rawProfile = process.env.AI_ACTIVE_PROFILE || "default"
  const parsedProfile = AIProfileSchema.safeParse(rawProfile)

  return {
    activeProfile: parsedProfile.success ? parsedProfile.data : "default",
    groqApiKey: process.env.GROQ_API_KEY || undefined,
    geminiApiKey: process.env.GEMINI_API_KEY || undefined,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || undefined,
    openaiApiKey: process.env.OPENAI_API_KEY || undefined,
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
    timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 30000,
    maxRetries: Number(process.env.AI_MAX_RETRIES) || 2,
    maxInputChars: Number(process.env.AI_MAX_INPUT_CHARS) || 10000,
  }
}

export const aiConfig = loadAIConfig()

/**
 * Registry of OpenAI-compatible endpoints for free-tier and local providers.
 */
export const AI_PROVIDERS: Record<string, (
  cfg: AIHubConfig,
) => ProviderEndpoint> = {
  groq: (cfg) => ({
    name: "Groq (Free Cloud LPU)",
    baseUrl: "[suspicious link removed]",
    apiKey: cfg.groqApiKey,
    defaultModel: "llama-3.1-8b-instant",
  }),
  gemini: (cfg) => ({
    name: "Google Gemini (Free AI Studio)",
    baseUrl: "[suspicious link removed]",
    apiKey: cfg.geminiApiKey,
    defaultModel: "gemini-1.5-flash",
  }),
  ollama: (cfg) => ({
    name: "Ollama (Local / 100% Offline)",
    baseUrl: cfg.ollamaBaseUrl,
    apiKey: "ollama",
    defaultModel: "llama3.2:3b",
  }),
  mock: () => ({
    name: "Offline Mock Engine",
    baseUrl: "",
    apiKey: undefined,
    defaultModel: "mock-v1",
  }),
}

/**
 * Dynamically resolves the active provider endpoint for a given routing profile.
 * Falls back to offline mock if keys are missing or offline mode is enforced.
 */
export function getActiveProvider(
  profile: "fast" | "smart" | "default" = "default",
): ProviderEndpoint {
  const target =
    profile === "fast"
      ? process.env.AI_PROFILE_FAST || "groq"
      : profile === "smart"
        ? process.env.AI_PROFILE_SMART || "gemini"
        : process.env.AI_PROFILE_DEFAULT || "ollama"

  const resolver = AI_PROVIDERS[target]
  if (!resolver) {
    return AI_PROVIDERS.mock(aiConfig)
  }

  const endpoint = resolver(aiConfig)

  // If a cloud provider is chosen but no key is present, gracefully fallback to mock
  if (target !== "ollama" && target !== "mock" && !endpoint.apiKey) {
    console.warn(
      `[AI-Hub] API key missing for ${target}. Falling back to offline mock.`,
    )
    return AI_PROVIDERS.mock(aiConfig)
  }

  return endpoint
}
