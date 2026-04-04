import { z } from "zod";

export const signupPayModel = z.object({
    firstName: z.string().min(2),
    lastName: z.string().optional().nullable(),
    email: z.email(),
    password: z.string().min(8),
});

export const signinPayModel = z.object({
    email: z.email(),
    password: z.string().min(8),
});