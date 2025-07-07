import type { Request, Response, NextFunction } from "express";
import { ErrorFactory, AppError } from "./error-factory";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err.message);

  if (err instanceof AppError) {
    res.status(err.statusCode).json(err.toResponse());
    return;
  }

  const errorResponse = ErrorFactory.fromExpressError(err);
  res.status(errorResponse.statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const errorResponse = ErrorFactory.notFound(
    `Route ${req.originalUrl} not found`
  );
  res.status(404).json(errorResponse);
};
