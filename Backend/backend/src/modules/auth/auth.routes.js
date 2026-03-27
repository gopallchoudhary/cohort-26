import { Router } from "express";
import * as controller from "./auth.controller";
import validate from "../../common/middleware/validate.middleware";
import RegisterDto from "./dto/register.dto";

const router = Router()

router.post("/register", validate(RegisterDto), controller.register)
router.post("/login", validate(RegisterDto), controller.login)

