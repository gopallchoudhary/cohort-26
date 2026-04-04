import express from "express";
import type { Express } from "express";
import { authRouter } from "./auth/routes.js";
import { authenticationMiddleware } from "./middleware/auth-middleware.js";

export function createApplication(): Express {
    const app = express();

    //middlewares
    app.use(express.json());
    app.use(authenticationMiddleware)


    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.use("/auth", authRouter)

    return app;
}