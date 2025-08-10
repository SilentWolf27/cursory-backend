import { aiConfig } from "../../config/environment";
import { AIModelConfig, AIModelProvider } from "./types";
import OpenAI from "openai";

function createOpenAIClient({ apiKey }: AIModelConfig): OpenAI {
  if (!apiKey) throw new Error("OpenAI API key is not configured");

  return new OpenAI({
    apiKey,
  });
}

/**
 * Create an OpenAI client instance
 * @param provider - AI provider (currently only supports openai)
 * @returns OpenAI client instance or null
 */
export function createModel(provider: AIModelProvider): {
  model: OpenAI;
  config: AIModelConfig;
} {
  const config = aiConfig[provider] as AIModelConfig;

  if (!config) throw new Error(`${provider.toUpperCase()} is not configured`);

  if (provider === "openai")
    return { model: createOpenAIClient(config), config };

  throw new Error(`${provider} is not supported`);
}
