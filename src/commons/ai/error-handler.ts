import { ErrorFactory } from "../error/error-factory";

/**
 * Handle AI-related errors with proper error formatting
 * @param error - The error to handle
 * @returns Formatted error
 */
export function handleAIError(error: unknown): Error {
  if (error instanceof Error) {
    // Handle specific AI service errors
    if (error.message.includes("API key")) {
      return ErrorFactory.unauthorized(
        "AI service API key is invalid or missing"
      );
    }
    if (error.message.includes("rate limit")) {
      return ErrorFactory.badRequest("AI service rate limit exceeded");
    }
    if (error.message.includes("quota")) {
      return ErrorFactory.badRequest("AI service quota exceeded");
    }
    if (error.message.includes("model")) {
      return ErrorFactory.badRequest("Invalid AI model specified");
    }

    return ErrorFactory.internal(`AI service error: ${error.message}`);
  }

  return ErrorFactory.internal("Unknown AI service error");
}
