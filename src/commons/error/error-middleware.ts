import type { Request, Response, NextFunction } from "express";
import { ErrorFactory } from "./error-factory";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err.message);
  const errorResponse = ErrorFactory.fromExpressError(err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const errorResponse = ErrorFactory.notFoundError(
    `Route ${req.originalUrl} not found`
  );
  res.status(404).json(errorResponse);
};
