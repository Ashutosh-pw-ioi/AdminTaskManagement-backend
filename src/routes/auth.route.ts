import { Router } from "express";
import { checkUserAuthentication, handleLogin, handleLogout } from "../controller/auth.controller.js";
import { authDynamic } from "../middleware/auth.dynamicMiddleware.js";

const authRouter = Router();


authRouter.post("/login", handleLogin);
authRouter.post("/logout", authDynamic, handleLogout);
authRouter.get("/check", authDynamic, checkUserAuthentication);

export default authRouter;
