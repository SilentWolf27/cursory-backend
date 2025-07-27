import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import type { ChatOpenAI } from "@langchain/openai";

/**
 * Create a simple chain from prompt template and model
 * @param prompt - ChatPromptTemplate
 * @param model - ChatOpenAI model instance
 * @returns RunnableSequence
 */
export function createSimpleChain<TInput>(
  prompt: ChatPromptTemplate,
  model: ChatOpenAI
): RunnableSequence<TInput, string> {
  const outputParser = new StringOutputParser();

  return RunnableSequence.from([prompt, model, outputParser]);
}
