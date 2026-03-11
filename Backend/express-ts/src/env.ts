import {z} from "zod";


const envSchema = z.object({
    PORT: z.string().optional()
})


function createEnvSchema(env:NodeJS.ProcessEnv) {
    const safeParseResult = envSchema.safeParse(env)
    if(!safeParseResult.success) throw new Error(safeParseResult.error.message)
    return safeParseResult.data
}



export const env = createEnvSchema(process.env)