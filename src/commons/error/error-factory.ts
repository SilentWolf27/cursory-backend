export interface ErrorResponse {
  code: string;
  error: string;
  statusCode: number;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }

  toResponse(): ErrorResponse {
    return {
      code: this.code,
      error: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class ErrorFactory {
  static validation(err: any): AppError {
    const details = err.errors
      ?.map((e: any) => `${e.path}: ${e.message}`)
      .join(", ");
    return new AppError(
      `Validation failed: ${details || err.message}`,
      "VALIDATION_ERROR",
      400
    );
  }

  static notFound(message: string = "Resource not found"): AppError {
    return new AppError(message, "NOT_FOUND", 404);
  }

  static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(message, "UNAUTHORIZED", 401);
  }

  static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, "FORBIDDEN", 403);
  }

  static badRequest(message: string): AppError {
    return new AppError(message, "BAD_REQUEST", 400);
  }

  static internal(message: string = "Internal server error"): AppError {
    return new AppError(message, "INTERNAL_ERROR", 500);
  }

  static database(message: string = "Database error"): AppError {
    return new AppError(message, "DATABASE_ERROR", 500);
  }

  static conflict(message: string): AppError {
    return new AppError(message, "CONFLICT", 409);
  }

  static fromExpressError(err: any): ErrorResponse {
    const status = err.status || err.statusCode;

    if (status === 400) return this.validation(err).toResponse();

    if (status === 401) return this.unauthorized(err.message).toResponse();

    if (status === 403) return this.forbidden(err.message).toResponse();

    if (status === 404) return this.notFound(err.message).toResponse();

    if (status === 409) return this.conflict(err.message).toResponse();

    return this.internal(err.message).toResponse();
  }
}
