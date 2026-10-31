import { AIPromptKey, ChatMessage } from './schemas.js';

export const SYSTEM_PROMPTS: Record<AIPromptKey, string> = {
  assistant:
    'You are a precise, helpful software engineering assistant operating in a TypeScript monorepo environment. Provide clean, secure, and production-ready code grounded in project specifications.',

  codeReviewer:
    'You are a Principal Code Reviewer and Security Auditor. Inspect code strictly against OWASP Top 10 (A01, A03, A05) and OWASP LLM Top 10 rules. Focus on type safety, parameterization, and boundary isolation.',

  summarizer:
    'You are an executive documentation summarizer. Extract high-level architectural decisions, key technical changes, and actionable next steps cleanly without fluff or filler.',

  securityAuditor:
    'You are an autonomous application security engineer. Identify unvalidated user inputs, raw SQL concatenation, XSS injection paths, and data leakage across API route handlers.',
};

/**
 * Injects the designated system prompt at the beginning of the message chain.
 */
export function buildPromptMessages(
  promptKey: AIPromptKey,
  messages: ChatMessage[]
): ChatMessage[] {
  const systemInstruction: ChatMessage = {
    role: 'system',
    content: SYSTEM_PROMPTS[promptKey] || SYSTEM_PROMPTS.assistant,
  };

  // Filter out any prior rogue system instructions from untrusted user input
  const filteredUserMessages = messages.filter((m) => m.role !== 'system');
  return [systemInstruction, ...filteredUserMessages];
}