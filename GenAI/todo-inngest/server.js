import express from "express";
import 'dotenv/config'
import {createTodo, updateTodo, deleteTodo, getTodos} from "./store.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onTodoCreated, onTodoDeleted } from "./inngest/functions.js";


const app = express()
app.use(express.json())

app.use('/api/inngest', 
    serve({
        client: inngest,
        functions: [onTodoCreated, onTodoDeleted]
    }
))

app.post('/todos', async (req, res) => {
    const { title } = req.body
    if (!title) {
        res.status(400).json({ error: "title is required" })
    }
    const todo = createTodo(title)
    await inngest.send(
        {
            name:  'todo/created',
            data: {todo}
        }
    )
    res.status(201).json(todo)
})

app.put('/todos/:id', (req, res) => {
    const { id } = req.params
    const patch = req.body

    const todo = updateTodo(id, patch)
    if (!todo) {
        return res.status(404).json({ error: "not found" })
    }

    res.status(201).json(todo)
})

app.delete('/todos/:id', async(req, res) => {
    const id = parseInt(req.params.id)
    const todo = deleteTodo(id)

    if (!todo) {
        return res.status(404).json({ error: "not found" })
    }

    await inngest.send(
        {
            name: 'todo/deleted',
            data: {todo}
        }
    )


    res.status(201).json(todo)
})

// show all todos
app.get('/todos', async (req, res) => {
    const todos = getTodos()
    res.status(200).json(todos)
})



app.listen(3000, () => {
    console.log("Server running on port 3000")
})