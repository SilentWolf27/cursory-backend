import { ErrorFactory } from "../../commons/error/error-factory";
import { createModel } from "../../commons/ai/model-handler";
import { Course } from "../domain/course";
import {
  createPromptTemplate,
  createSystemMessage,
  createUserMessage,
} from "../../commons/ai/prompt-handler";
import { createSimpleChain } from "../../commons/ai/chain-handler";

export interface GenerateCourseRequest {
  description: string;
  objective: string;
  difficulty: string;
}

export type GeneratedCourse = Pick<
  Course,
  "title" | "description" | "slug" | "tags" | "visibility"
>;

/**
 * Get the system prompt for course generation
 * @returns System prompt string
 */
function getCourseGenerationSystemPrompt(): string {
  return `Eres un experto en diseño instruccional y en educación tecnológica. Tu tarea es ayudar a crear la base de un curso atractivo, claro y bien estructurado para una plataforma de organización de conocimiento llamada Cursory.
  
  Debes generar:
  
  1. Título del curso: breve, claro y profesional, con enfoque técnico si aplica.
  2. Descripción: motivadora, precisa y sin exageraciones. Explica qué aprenderá el estudiante y por qué es útil.
  3. Slug: una versión URL amigable del título (en minúsculas, sin espacios ni caracteres especiales).
  4. Tags sugeridos: una lista de 3 a 6 etiquetas relevantes al contenido del curso.
  
  El tono debe ser técnico y profesional, sin lenguaje informal ni de ventas.
  Tu salida **debe ser únicamente un objeto JSON** con las siguientes claves: \`title\`, \`description\`, \`slug\`, \`tags\`.`;
}

/**
 * Get the user prompt template for course generation
 * @returns User prompt template string
 */
function getCourseGenerationUserPrompt(): string {
  return `Quiero crear un curso sobre "{tema}".
  Está dirigido a estudiantes de nivel {nivel}.
  Al finalizar, los participantes deberían poder: {objetivo}.`;
}

/**
 * Generate course basic information using AI
 * @param request - Generate course request
 * @returns Generated course information
 */
export async function generateCourseUseCase(
  request: GenerateCourseRequest
): Promise<string> {
  const { description, objective, difficulty } = request;

  const model = createModel("openai");
  if (!model) throw ErrorFactory.internal("AI model not available");

  const systemPrompt = getCourseGenerationSystemPrompt();
  const userPrompt = getCourseGenerationUserPrompt();

  const prompt = createPromptTemplate([
    createSystemMessage(systemPrompt),
    createUserMessage(userPrompt),
  ]);

  const chain = createSimpleChain(prompt, model);

  const response = await chain.invoke({
    description,
    objective,
    difficulty,
  });

  return response;
}
