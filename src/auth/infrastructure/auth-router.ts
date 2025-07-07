import { Router } from "express";
import { handleLogin, handleLogout, handleGetSession, handleRefresh } from "./auth-controller";
import { authMiddleware } from "./auth-middleware";

const authRouter = Router();

// Public routes
authRouter.post("/login", handleLogin);
authRouter.post("/refresh", handleRefresh);

// Protected routes
authRouter.post("/logout", authMiddleware, handleLogout);
authRouter.get("/session", authMiddleware, handleGetSession);

export { authRouter };
