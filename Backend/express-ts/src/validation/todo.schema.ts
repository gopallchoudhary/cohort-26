import { z } from 'zod'

export const todoValidationSchema = z.object({
    id: z.string().describe("id of the todo"),
    title: z.string().describe("Title of the todo"),
    description: z.string().optional().describe("description of the todo"),
    isCompleted: z.boolean().default(false).describe("is todo is completed or not")
})


export type Todo = z.infer<typeof todoValidationSchema>