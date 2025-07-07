import { Router } from "express";
import { handleLogin, handleLogout, handleGetSession } from "./auth-controller";

const authRouter = Router();

authRouter.post("/login", handleLogin);
authRouter.post("/logout", handleLogout);
authRouter.get("/session", handleGetSession);

export { authRouter };
