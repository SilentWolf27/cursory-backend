import { ErrorFactory } from "../../commons/error/error-factory";
import { createModel } from "../../commons/ai/model-handler";
import { Course } from "../domain/course";
import { getResponse } from "../../commons/ai/utils";

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

- El tono debe ser técnico, claro y profesional.
- Utiliza lenguaje preciso pero accesible, evitando jergas innecesarias.

Evita cualquier lenguaje de venta o promoción exagerada.
La descripción debe explicar a quién está dirigido el curso, qué aprenderán los estudiantes y para qué les servirá, todo de forma concisa y sin usar etiquetas como "básico", "intermedio" o "avanzado".

Tu salida debe ser **exclusivamente** un objeto JSON válido con las siguientes claves: \`title\`, \`description\`, \`slug\`, \`tags\`.`;
}

/**
 * Generate course basic information using AI
 * @param request - Generate course request
 * @returns Generated course information
 */
export async function generateCourseUseCase(
  request: GenerateCourseRequest
): Promise<GeneratedCourse> {
  const { description, objective, difficulty } = request;

  const { model, config } = createModel("openai");

  const userPrompt = `Quiero crear un curso sobre "${description}".
Está dirigido a estudiantes de nivel ${difficulty}.
Al finalizar, los participantes deberían poder: ${objective}.`;

  const messages = [
    { role: "system" as const, content: getCourseGenerationSystemPrompt() },
    { role: "user" as const, content: userPrompt },
  ];

  try {
    const response = await getResponse({
      model,
      messages,
      config,
      responseFormat: "json_object",
    });

    return JSON.parse(response) as GeneratedCourse;
  } catch (error) {
    throw ErrorFactory.internal(`AI generation failed: ${error}`);
  }
}
