import {
  AIMessage,
  type AIMessageChunk,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import type { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { handleAIError } from "./error-handler";

type Message = AIMessage | HumanMessage | SystemMessage;

/**
 * Create a LangChain message object for AI interactions
 * @param role - Message role (system, user, or assistant)
 * @param content - Message content
 * @returns LangChain message object (SystemMessage, HumanMessage, or AIMessage)
 */
export function createMessage(
  role: "system" | "user" | "assistant",
  content: string
): Message {
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
  response: AIMessageChunk
): Promise<string> {
  try {
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
export function createPromptTemplate(messages: Message[]): ChatPromptTemplate {
  return ChatPromptTemplate.fromMessages(messages);
}

/**
 * Create a prompt template from string records
 * @param messages - Array of [role, content] tuples
 * @returns ChatPromptTemplate instance
 */
export function createPromptTemplateFromRecords(
  messages: ["system" | "user" | "assistant", string][]
): ChatPromptTemplate {
  return ChatPromptTemplate.fromMessages(messages);
}

export async function invokePromptTemplate(
  model: ChatOpenAI,
  template: ChatPromptTemplate,
  input: Record<string, string>
): Promise<string> {
  const response = await template.invoke({
    ...input,
  });

  const result = await model.invoke(response);

  return generateResponse(result);
}
