import { Request, Response } from "express";
import { Todo, todoValidationSchema } from "../../validation/todo.schema.js";



export class TodoController {
    private _db: Todo[]

    constructor() {
        this._db = []
    }

    public handleGetAllTodos(req: Request, res: Response) {
        const todos = this._db
        return res.json({ todos })
    }

    public async handleAddTodos(req: Request, res: Response) {
        try {
            const unvalidated = req.body
            const safeParseResult = await todoValidationSchema.parseAsync(unvalidated)
            this._db.push(safeParseResult)
            return res.status(201).json({ message: "Todo created successfully", todos: this._db })
        } catch (error) {
            return res.status(501).json({ error })
        }
    }

    public async handleUpdateTodo(req: Request, res: Response) {
        const { id } = req.params

        try {
            const index = this._db.findIndex((todo) => todo.id === id)

            if (index === -1) {
                return res.status(404).json({ message: "Todo not found" })
            }

            const existingTodo = this._db[index]
            const incomingData = req.body as Partial<Todo>

            const mergedTodo = { ...existingTodo, ...incomingData, id: existingTodo.id }

            const safeParseResult = await todoValidationSchema.parseAsync(mergedTodo)

            this._db[index] = safeParseResult

            return res.json({
                message: "Todo updated successfully",
                todo: this._db[index],
                todos: this._db,
            })
        } catch (error) {
            return res.status(400).json({ error })
        }
    }

    public handleDeleteTodo(req: Request, res: Response) {
        const { id } = req.params

        const index = this._db.findIndex((todo) => todo.id === id)

        if (index === -1) {
            return res.status(404).json({ message: "Todo not found" })
        }

        const [deletedTodo] = this._db.splice(index, 1)

        return res.json({
            message: "Todo deleted successfully",
            deletedTodo,
            todos: this._db,
        })
    }

}