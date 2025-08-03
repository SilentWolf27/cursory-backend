import { ErrorFactory } from "../../commons/error/error-factory";
import { createModel } from "../../commons/ai/model-handler";
import { Course } from "../domain/course";
import { createSimpleChain } from "../../commons/ai/chain-handler";
import { createPromptTemplateFromRecords } from "../../commons/ai/prompt-handler";
import {
  parseJSONFromResponse,
  validateRequiredFields,
} from "../../commons/ai/output-parser";

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
): Promise<GeneratedCourse> {
  const { description, objective, difficulty } = request;

  const model = createModel("openai", { temperature: 1 });
  if (!model) throw ErrorFactory.internal("AI model not available");

  const prompt = createPromptTemplateFromRecords([
    ["system", getCourseGenerationSystemPrompt()],
    ...getCourseGenerationFewShotExamples(),
    ["user", getCourseGenerationUserPrompt()],
  ]);

  const chain = createSimpleChain(prompt, model);

  const response = await chain.invoke({
    tema: description,
    nivel: difficulty,
    objetivo: objective,
  });

  return parseCourseResponse(response);
}

/**
 * Parse the AI response into a GeneratedCourse object
 * @param response - Raw AI response string
 * @returns Parsed GeneratedCourse object
 */
function parseCourseResponse(response: string): GeneratedCourse {
  const parsed = parseJSONFromResponse(response);
  const validated = validateRequiredFields(parsed, [
    "title",
    "description",
    "slug",
    "tags",
  ]);

  return {
    title: validated.title,
    description: validated.description,
    slug: validated.slug,
    tags: Array.isArray(validated.tags) ? validated.tags : [],
    visibility: "PRIVATE",
  };
}

export function getCourseGenerationFewShotExamples(): [
  "system" | "user" | "assistant",
  string
][] {
  return [
    [
      "user",
      `Quiero crear un curso sobre "Curso básico de esp32 en arduino".
Está dirigido a estudiantes de nivel básico.
Al finalizar, los participantes deberían poder: configurar y utilizar los principales periféricos de la tarjeta esp32 en el entorno arduino.`,
    ],
    [
      "assistant",
      `{{
  "title": "Introducción al ESP32 con Arduino",
  "description": "Este curso está orientado a personas que desean iniciarse en el desarrollo de proyectos embebidos utilizando el ESP32. Aprenderás a configurar el entorno Arduino y a utilizar los principales periféricos del microcontrolador, incluyendo entradas y salidas digitales, PWM, comunicación UART, y funcionalidades de conectividad como WiFi. El curso combina teoría práctica y te permitirá crear tus primeros prototipos funcionales.",
  "slug": "introduccion-esp32-arduino",
  "tags": ["ESP32", "Arduino", "desarrollo embebido", "IoT", "microcontroladores", "periféricos"]
}}`,
    ],
    [
      "user",
      `Quiero crear un curso sobre "Fundamentos de LangChain para trabajar con LLMs".
Está dirigido a estudiantes de nivel intermedio.
Al finalizar, los participantes deberían poder: construir cadenas básicas de procesamiento con LangChain e integrarlas en aplicaciones de lenguaje natural.`,
    ],
    [
      "assistant",
      `{{
  "title": "Fundamentos de LangChain para modelos de lenguaje",
  "description": "LangChain es una herramienta que permite estructurar flujos conversacionales con modelos de lenguaje como GPT. Este curso introduce sus principales componentes: cadenas, agentes y herramientas de memoria, proporcionando las bases para construir aplicaciones NLP personalizadas.",
  "slug": "fundamentos-langchain-llm",
  "tags": ["LangChain", "LLM", "NLP", "procesamiento de lenguaje", "Python", "aplicaciones inteligentes"]
}}`,
    ],
    [
      "user",
      `Quiero crear un curso sobre "Diseño de prompts y uso de la API de OpenAI".
Está dirigido a estudiantes de nivel intermedio.
Al finalizar, los participantes deberían poder: diseñar prompts eficaces e integrar modelos de lenguaje en sus aplicaciones usando la API de OpenAI.`,
    ],
    [
      "assistant",
      `{{
  "title": "Diseño de Prompts y uso de la API de OpenAI",
  "description": "¿Cómo lograr que un modelo de lenguaje te dé exactamente lo que necesitas? Este curso explora los principios del prompt engineering y te guía paso a paso en la integración de la API de OpenAI usando Python. Ideal para quienes desean potenciar sus proyectos con capacidades avanzadas de lenguaje natural.",
  "slug": "diseno-prompts-openai-api",
  "tags": ["OpenAI", "prompts", "API", "modelo de lenguaje", "NLP", "Python"]
}}`,
    ]
  ];
}

