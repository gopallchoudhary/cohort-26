import { Router } from "express";
import * as controller from "./auth.controller.js";
import validate from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDTO from "./dto/login.dto.js";
import ForgotPasswordDTO from "./dto/forgot-password.js";
import { authenticate } from "./auth.middleware.js";

const router = Router()

router.post("/register", validate(RegisterDto), controller.register)
router.post("/login", validate(LoginDTO), controller.login)
router.post("/refresh-token", controller.refreshToken)
router.post("/logout", authenticate, controller.logout)



export default router