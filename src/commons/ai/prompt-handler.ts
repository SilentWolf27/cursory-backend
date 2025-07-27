import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import type { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { handleAIError } from "./error-handler";

/**
 * Create a LangChain message object for AI interactions
 * @param role - Message role (system, user, or assistant)
 * @param content - Message content
 * @returns LangChain message object (SystemMessage, HumanMessage, or AIMessage)
 */
export function createMessage(
  role: "system" | "user" | "assistant",
  content: string
): AIMessage | SystemMessage | HumanMessage {
  switch (role) {
    case "system":
      return new SystemMessage(content);
    case "user":
      return new HumanMessage(content);
    case "assistant":
      return new AIMessage(content);
  }
}

/**
 * Create a LangChain SystemMessage
 * @param content - System message content
 * @returns LangChain SystemMessage instance
 */
export function createSystemMessage(content: string): SystemMessage {
  return createMessage("system", content);
}

/**
 * Create a LangChain HumanMessage
 * @param content - User message content
 * @returns LangChain HumanMessage instance
 */
export function createUserMessage(content: string): HumanMessage {
  return createMessage("user", content);
}

/**
 * Create a LangChain AIMessage
 * @param content - Assistant message content
 * @returns LangChain AIMessage instance
 */
export function createAssistantMessage(content: string): AIMessage {
  return createMessage("assistant", content);
}

/**
 * Generate AI response using LangChain
 * @param messages - Array of messages for the conversation
 * @param model - ChatOpenAI model instance
 * @returns AI response content
 */
export async function generateResponse(
  messages: (AIMessage | HumanMessage | SystemMessage)[],
  model: ChatOpenAI
): Promise<string> {
  try {
    const response = await model.invoke(messages);
    return response.content as string;
  } catch (error) {
    throw handleAIError(error);
  }
}

/**
 * Create a prompt template with variables
 * @param template - Template string with {variable} placeholders
 * @param inputVariables - Array of variable names
 * @returns PromptTemplate instance
 */
export function createPromptTemplate(
  template: string,
  inputVariables: string[]
): PromptTemplate {
  return new PromptTemplate({
    template,
    inputVariables,
  });
}
