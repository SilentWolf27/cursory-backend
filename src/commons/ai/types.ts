export interface AIModelConfig {
  apiKey?: string;
  model: string;
  temperature: number;
}

export type AIModelProvider = "openai";

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
