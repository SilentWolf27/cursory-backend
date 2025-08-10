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

1. **Título del curso**: breve, claro y profesional, con enfoque técnico si aplica.
2. **Descripción**: motivadora, precisa y sin exageraciones. Explica qué aprenderá el estudiante y por qué es útil.
3. **Slug**: una versión URL amigable del título (en minúsculas, sin espacios ni caracteres especiales).
4. **Tags sugeridos**: una lista de 3 a 6 etiquetas relevantes al contenido del curso.

## Características de una buena descripción:


- **Contexto técnico**: Explica el fundamento tecnológico o conceptual
- **Aplicaciones prácticas**: Menciona casos de uso reales y aplicaciones
- **Beneficios claros**: Qué aprenderán y por qué es valioso
- **Progresión**: Cómo el curso lleva de conceptos básicos a aplicaciones avanzadas
- **Tono profesional**: Técnico pero accesible, sin jerga innecesaria

## Reglas importantes:

- El tono debe ser técnico, claro y profesional
- Utiliza lenguaje preciso pero accesible, evitando jergas innecesarias
- Evita cualquier lenguaje de venta o promoción exagerada
- La descripción debe explicar a quién está dirigido el curso, qué aprenderán los estudiantes y para qué les servirá
- No uses etiquetas como "básico", "intermedio" o "avanzado"
- Mantén un enfoque en el valor práctico y aplicaciones reales

Tu salida debe ser **exclusivamente** un objeto JSON válido con las siguientes claves: \`title\`, \`description\`, \`slug\`, \`tags\`.`;
}

/**
 * Get few-shot examples for course generation
 * @returns Array of example messages
 */
function getCourseGenerationExamples() {
  return [
    {
      role: "user" as const,
      content: `Quiero crear un curso sobre "modelos de embedding de texto para aplicaciones de IA".
Está dirigido a estudiantes de nivel intermedio.
Al finalizar, los participantes deberían poder: implementar sistemas de embedding de texto, crear aplicaciones de búsqueda semántica y utilizar bases de datos vectoriales para almacenar y consultar embeddings.`
    },
    {
      role: "assistant" as const,
      content: JSON.stringify({
        title: "Modelos de Embedding de Texto para Aplicaciones de IA",
        description: "Los modelos de embedding de texto crean representaciones numéricas a partir de entradas de texto. Esta capacidad de codificar texto y capturar su significado semántico significa que los modelos de embedding sustentan muchos tipos de aplicaciones de IA, como motores de búsqueda semántica y sistemas de recomendación. En este curso, aprenderás a aprovechar el modelo de Embeddings de OpenAI a través de la API de OpenAI para crear embeddings a partir de conjuntos de datos de texto y comenzar a desarrollar aplicaciones del mundo real. También darás un gran paso hacia la creación de aplicaciones listas para producción al aprender sobre bases de datos vectoriales para almacenar y consultar textos embebidos de manera eficiente.",
        slug: "modelos-embedding-texto-aplicaciones-ia",
        tags: ["IA", "Embeddings", "OpenAI", "Bases de Datos Vectoriales", "Búsqueda Semántica"]
      })
    },
    {
      role: "user" as const,
      content: `Quiero crear un curso sobre "desarrollo de aplicaciones de IA listas para producción".
Está dirigido a estudiantes de nivel avanzado.
Al finalizar, los participantes deberían poder: implementar mejores prácticas de seguridad y validación, conectar aplicaciones con sistemas externos y elevar proyectos de prueba de concepto a sistemas de producción.`
    },
    {
      role: "assistant" as const,
      content: JSON.stringify({
        title: "Aplicaciones de IA para Producción",
        description: "Prepara tus aplicaciones de IA para producción con este curso sobre la API de OpenAI. Descubrirás las mejores prácticas para desarrollar aplicaciones en la API de OpenAI, incluyendo moderación y validación, pruebas, y prácticas para mejorar la seguridad. También aprenderás a conectar tu aplicación con sistemas externos y APIs a través de function calling. Este curso se basa en las funcionalidades principales de OpenAI introducidas en 'Trabajando con la API de OpenAI' y las mejores prácticas de escritura de prompts de 'Ingeniería de Prompts con la API de OpenAI' para ayudarte a elevar tus proyectos desde prueba de concepto hasta sistemas listos para producción.",
        slug: "aplicaciones-ia-produccion",
        tags: ["IA", "OpenAI", "Producción", "Seguridad", "APIs", "Function Calling"]
      })
    }
  ];
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
    ...getCourseGenerationExamples(),
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
