import { inngest } from "./client.js";
import { auditlog } from "../store.js";

export const onTodoCreated = inngest.createFunction(
    {
        id: 'on-todo-created',
        triggers: [{event: 'todo/created'}]
    },

    async({event, step}) => {
        await step.run('audit', async() => {
            auditlog.push({
                action: 'created',
                todoId: event.data.todo.id,
                title: event.data.todo.title,
                timestamp: new Date().toISOString()
            });

            return {ok: true}
        })
    },
)


export const onTodoDeleted = inngest.createFunction(
    {
        id: 'on-todo-deleted',
        retries: 2,
        triggers: [{event: 'todo/deleted'}]
    },

    async({event, step, attempt}) => {
        const id = event.data.todo.id

        await step.run('cleanup', async() => {
            if(attempt === 0) {
                throw new Error(`Failed to cleanup after deleting the todo ${id}`)
            }

            return 'cleaned up successfully'
        })

        await step.run('audit', async() => {
            auditlog.push({
                action: 'deleted',
                todoId: id
            })

            return {ok: true}
        })
    }
)

export const onTodoUpdated = inngest.createFunction(
    {
        id: 'on-todo-updated',
        retries: 2,
        triggers: [{event: 'todo/updated'}]
    },

    async({event, step}) => {
        const id = event.data.todo.id

        await step.run('audit', async () => {
            auditlog.push({
                action: 'updated',
                todoId: id,
                title: event.data.todo.title,
                timestamp: new Date().toISOString()
            })
        })
    }
)