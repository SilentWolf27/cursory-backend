import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwt-service";
import { userRepository } from "./user-repository";
import { ErrorFactory } from "../../commons/error/error-factory";

/**
 * Authentication middleware
 * Verifies access token from cookies and attaches user to request
 */
export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken)
      throw ErrorFactory.unauthorized("Access token is required");

    const decoded = verifyToken(accessToken);
    if (!decoded) throw ErrorFactory.unauthorized("Invalid access token");

    const user = await userRepository.findById(decoded.userId);
    if (!user) throw ErrorFactory.unauthorized("User not found");

    if (user.deletedAt)
      throw ErrorFactory.unauthorized("Account is deactivated");

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
