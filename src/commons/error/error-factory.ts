export interface ErrorResponse {
  code: string;
  error: string;
}

export class ErrorFactory {
  static validationError(err: any): ErrorResponse {
    const details = err.errors
      ?.map((e: any) => `${e.path}: ${e.message}`)
      .join(", ");
    return {
      code: "VALIDATION_ERROR",
      error: `Validation failed: ${details || err.message}`,
    };
  }

  static notFoundError(message: string = "Resource not found"): ErrorResponse {
    return {
      code: "NOT_FOUND",
      error: message,
    };
  }

  static unauthorizedError(message: string = "Unauthorized"): ErrorResponse {
    return {
      code: "UNAUTHORIZED",
      error: message,
    };
  }

  static forbiddenError(message: string = "Forbidden"): ErrorResponse {
    return {
      code: "FORBIDDEN",
      error: message,
    };
  }

  static badRequestError(message: string): ErrorResponse {
    return {
      code: "BAD_REQUEST",
      error: message,
    };
  }

  static internalError(
    message: string = "Internal server error"
  ): ErrorResponse {
    return {
      code: "INTERNAL_ERROR",
      error: message,
    };
  }

  static databaseError(message: string = "Database error"): ErrorResponse {
    return {
      code: "DATABASE_ERROR",
      error: message,
    };
  }

  static fromExpressError(err: any): ErrorResponse {
    const status = err.status || err.statusCode;

    // Handle express-openapi-validator errors
    if (status === 400) {
      return this.validationError(err);
    }

    // Handle other known error types
    if (status === 401) {
      return this.unauthorizedError(err.message);
    }

    if (status === 403) {
      return this.forbiddenError(err.message);
    }

    if (status === 404) {
      return this.notFoundError(err.message);
    }

    // Default to internal error
    return this.internalError(err.message);
  }
}
