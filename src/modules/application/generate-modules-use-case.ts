import { ErrorFactory } from "../../commons/error/error-factory";
import { createModel } from "../../commons/ai/model-handler";
import { Module } from "../domain/module";
import { getResponse } from "../../commons/ai/utils";
import type { CourseRepository } from "../../courses/domain/course-repository";

export interface GenerateModulesRequest {
  courseId: string;
  suggestedTopics: string;
  numberOfModules: number;
  approach: string;
  userId: string;
}

export type GeneratedModule = Pick<
  Module,
  "title" | "description" | "order" | "objectives"
>;

/**
 * Get the system prompt for modules generation
 * @returns System prompt string
 */
function getModulesGenerationSystemPrompt(): string {
  return `Eres un experto en diseño instruccional y en educación tecnológica. Tu tarea es ayudar a crear módulos de aprendizaje bien estructurados para un curso en la plataforma Cursory.

Debes generar una lista de módulos que cumplan con lo siguiente:

1. **Título del módulo**: claro, específico y relacionado con el contenido del curso.
2. **Descripción**: explica qué se cubrirá en el módulo y qué aprenderá el estudiante.
4. **Objetivos**: lista de 2 a 4 objetivos de aprendizaje específicos y medibles que el estudiante logrará.

Los módulos deben:

- Seguir una progresión lógica, comenzando por los conceptos fundamentales y avanzando hacia aplicaciones más complejas.
- Mantener coherencia con el título, descripción y objetivo general del curso.
- Adaptarse al enfoque especificado (práctico, teórico, mixto, etc.) si se proporciona, para ajustar el tipo de contenido y redacción de objetivos.
- Considerar los temas sugeridos, si existen, como guía para el contenido, **sin necesidad de que cada tema se convierta en un módulo separado.**

El tono debe ser técnico, claro y profesional.

Tu salida debe ser **exclusivamente** un objeto JSON válido con la siguiente estructura:

{
  "modules": [
    {
      "title": "Título del módulo",
      "description": "Descripción del módulo",
      "objectives": ["Objetivo 1", "Objetivo 2", "Objetivo 3"]
    }
  ]
}`;
}

/**
 * Generate modules for a course using AI
 * @param request - Generate modules request
 * @param courseRepository - Course repository to fetch course information
 * @returns Generated modules information
 */
export async function generateModulesUseCase(
  request: GenerateModulesRequest,
  courseRepository: CourseRepository
): Promise<{ modules: GeneratedModule[] }> {
  const { courseId, suggestedTopics, numberOfModules, approach, userId } =
    request;

  const course = await courseRepository.findById(courseId);
  if (!course) throw ErrorFactory.notFound("Course not found");

  if (course.userId !== userId)
    throw ErrorFactory.forbidden(
      "You are not allowed to generate modules for this course"
    );

  const { model, config } = createModel("openai");

  const userPrompt = `Quiero que me ayudes a crear ${numberOfModules} módulos para el siguiente curso:

📘 Título del curso: ${course.title}
📝 Descripción: ${course.description}

Aquí hay algunos temas que me gustaría que tomes en cuenta como guía para el contenido (no es necesario que cada uno se convierta en un módulo): ${suggestedTopics}

El curso tiene un enfoque ${approach}, así que adapta los contenidos y objetivos de cada módulo en función de eso.

Por favor, organiza los módulos de manera lógica y progresiva, desde los conceptos fundamentales hasta los más avanzados. Asegúrate de que cada módulo tenga un propósito claro y contribuya al aprendizaje general del curso.`;

  const messages = [
    { role: "system" as const, content: getModulesGenerationSystemPrompt() },
    { role: "user" as const, content: userPrompt },
  ];

  try {
    const response = await getResponse({
      model,
      messages,
      config,
      responseFormat: "json_object",
    });

    return JSON.parse(response) as { modules: GeneratedModule[] };
  } catch (error) {
    throw ErrorFactory.internal(`AI generation failed: ${error}`);
  }
}
