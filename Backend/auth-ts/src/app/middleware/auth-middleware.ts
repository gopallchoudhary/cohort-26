import type { Request, Response, NextFunction } from "express";
import { verifyUserToken } from "../auth/utils/token.js";


export function authenticationMiddleware() {
    return function (req: Request, res: Response, next: NextFunction) {
        const header = req.headers['authorization']

        if (!header) return res.status(401).json({ message: 'Unauthorized' })
        const token = header.split(' ')[1]

        if (!token) return res.status(401).json({ message: 'Unauthorized' })
        try {
            const user = verifyUserToken(token)
            //@ts-ignore
            req.user = user
            next()
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' })
        }
    }
}

export function restrictToAuthenticatedUsers() {
    return function (req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
        next()
    }
}