import { ErrorFactory } from "../error/error-factory";

/**
 * Parse JSON from AI response string
 * @param response - Raw AI response string
 * @returns Parsed JSON object
 */
export function parseJSONFromResponse(response: string): any {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in response");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw ErrorFactory.internal(
      `Failed to parse JSON response: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Validate required fields in parsed object
 * @param parsed - Parsed JSON object
 * @param requiredFields - Array of required field names
 * @returns Validated object
 */
export function validateRequiredFields(
  parsed: any,
  requiredFields: string[]
): any {
  for (const field of requiredFields) {
    if (!parsed[field])
      throw ErrorFactory.internal(`Missing required field: ${field}`);
  }
  return parsed;
}
