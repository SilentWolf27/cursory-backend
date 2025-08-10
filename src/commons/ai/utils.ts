import { AIModelConfig } from "./types";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/chat/completions";
import { OpenAI } from "openai";
import { ErrorFactory } from "../error/error-factory";

interface GetResponseParams {
  model: OpenAI;
  messages: ChatCompletionMessageParam[];
  config: AIModelConfig;
  tools?: ChatCompletionTool[];
  responseFormat?: "json_object";
}

export async function getResponse({
  model,
  messages,
  config,
  tools,
  responseFormat,
}: GetResponseParams): Promise<string> {
  const response = await model.chat.completions.create({
    model: config.model,
    messages,
    temperature: config.temperature,
    ...(tools && { tools }),
    ...(responseFormat && { response_format: { type: responseFormat } }),
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw ErrorFactory.internal("Empty response from AI model");

  return content;
}
