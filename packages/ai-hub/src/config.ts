import { AIProfile, AIProfileSchema } from './schemas.js';

export interface AIHubConfig {
  activeProfile: AIProfile;
  anthropicApiKey?: string;
  openaiApiKey?: string;
  geminiApiKey?: string;
  ollamaBaseUrl: string;
  timeoutMs: number;
  maxRetries: number;
  maxInputChars: number;
}

export function loadAIConfig(): AIHubConfig {
  const rawProfile = process.env.AI_ACTIVE_PROFILE || 'default';
  const parsedProfile = AIProfileSchema.safeParse(rawProfile);

  return {
    activeProfile: parsedProfile.success ? parsedProfile.data : 'default',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || undefined,
    openaiApiKey: process.env.OPENAI_API_KEY || undefined,
    geminiApiKey: process.env.GEMINI_API_KEY || undefined,
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 30000,
    maxRetries: Number(process.env.AI_MAX_RETRIES) || 2,
    maxInputChars: Number(process.env.AI_MAX_INPUT_CHARS) || 10000,
  };
}

export const aiConfig = loadAIConfig();