import { Router } from "express";
import AuthenticationController from "./controller.js";

export const authRouter: Router = Router();


const authenticationController = new AuthenticationController()

authRouter.post("/sign-up", authenticationController.handleSignUp.bind(authenticationController))
authRouter.post("/sign-in", authenticationController.handleSignin.bind(authenticationController))
authRouter.get("/getMe", authenticationController.handleMe.bind(authenticationController))

