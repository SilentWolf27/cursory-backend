import { aiConfig } from "../../config/environment";
import { AIModelConfig } from "./types";
import { ChatOpenAI } from "@langchain/openai";

function createOpenAIModel({
  apiKey,
  model,
  temperature = 0.7,
}: AIModelConfig): ChatOpenAI {
  if (!apiKey) throw new Error("OpenAI API key is not configured");
  if (!model) throw new Error("OpenAI model is not configured");
  return new ChatOpenAI({
    apiKey,
    model,
    temperature,
  });
}

/**
 * Create a LangChain ChatOpenAI model instance
 * @param provider - AI provider (currently only supports openai)
 * @returns ChatOpenAI model instance or null
 */
export function createModel(
  provider: "openai" = "openai",
  { temperature = 0.7 }: AIModelConfig = {}
): ChatOpenAI | null {
  const config = aiConfig[provider] as AIModelConfig;

  if (!config) throw new Error(`${provider.toUpperCase()} is not configured`);

  if (provider === "openai")
    return createOpenAIModel({ ...config, temperature });

  return null;
}
