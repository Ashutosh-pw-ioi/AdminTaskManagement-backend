import { Router } from "express";
import { handleLogin, handleLogout } from "../controller/auth.controller.js";
import { authDynamic } from "../middleware/auth.dynamicMiddleware.js";

const authRouter = Router();

authRouter.post("/login", handleLogin);
authRouter.post("/logout", authDynamic, handleLogout);


export default authRouter;
