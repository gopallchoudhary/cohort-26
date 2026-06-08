export const todos = []
export const auditlog = []

let nextId = 1

export function createTodo(title) {
    const todo = {
        id: nextId,
        title,
        completed: false,
        createdAt: new Date().toISOString()
    }
    todos.push(todo)
    nextId++
    return todo
}


export function getTodos() {
    return [...todos]
}

export function getTodo(id) {
    return todos.find(t => t.id === id)
}

export function updateTodo(id, patch) {
    const todo = getTodo(id)
    if (!todo) {
        return null
    }

    if (patch.title !== undefined && patch.title !== todo.title) {
        todo.title = patch.title
    }
    if (patch.completed !== undefined && patch.completed !== todo.completed) {
        todo.completed = patch.completed
    }

    return todo
}

export function deleteTodo(id) {
    const idx = todos.findIndex(t => t.id === id)
    if (idx === -1) return null
    return todos.splice(idx, 1)[0]
}

