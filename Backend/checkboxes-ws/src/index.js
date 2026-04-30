import express from "express";
import path from "node:path";
import http from 'node:http'
import { Server } from "socket.io";
import { publisher, subscriber, redis } from "../redis-connection.js";


const CHECKBOX_SIZE = 200
const CHECKBOX_STATE_KEY = 'checkbox-state'

const rateLimitingHashMap = new Map()


async function main() {
    const app = express()
    const server = http.createServer(app)
    const PORT = process.env.PORT ?? 8000
    const io = new Server()
    io.attach(server)

    const state = {
        checkboxes: new Array(CHECKBOX_SIZE).fill(false)
    };

    await subscriber.subscribe('internal-server:checkbox:change')
    subscriber.on('message', (channel, message) => {
        if (channel === 'internal-server:checkbox:change') {
            const { index, checked } = JSON.parse(message)
            state.checkboxes[index] = checked
            io.emit('server:checkbox:change', { index, checked })
        }
    })



    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);


        socket.on('client:checkbox:change', async (data) => {
            // Rate limiting per checkbox (not per socket)
            const rateLimitKey = `${socket.id}-checkbox-${data.index}`
            const lastTimeOperation = rateLimitingHashMap.get(rateLimitKey)

            if (lastTimeOperation) {
                const elapsedTime = Date.now() - lastTimeOperation
                if (elapsedTime < 3 * 1000) {
                    socket.emit('server-error', { error: 'Please wait before interacting with this checkbox again' })
                    return
                }
            }

            // Update timestamp for rate limiting this specific checkbox
            rateLimitingHashMap.set(rateLimitKey, Date.now())

            io.emit('server:checkbox:change', data)
            state.checkboxes[data.index] = data.checked




            const existingState = await redis.get('CHECKBOX_STATE_KEY')

            if (existingState) {
                const remoteData = JSON.parse(existingState)
                remoteData[data.index] = data.checked
                await redis.set('CHECKBOX_STATE_KEY', JSON.stringify(remoteData))
            } else {
                await redis.set('CHECKBOX_STATE_KEY', JSON.stringify(new Array(CHECKBOX_SIZE).fill(false)))
            }

            // USER -> Socket IO -> Redis server
            publisher.publish('internal-server:checkbox:change', JSON.stringify(data))
        })

    })


    app.use(express.static(path.resolve('public')))

    app.get('/healthy', (req, res) => res.json({ healthy: true }))
    app.get('/checkboxes', async (req, res) => {
        const existingState = await redis.get('CHECKBOX_STATE_KEY')
        if (existingState) {
            const remoteData = JSON.parse(existingState)
            return res.json({ checkboxes: remoteData })
        }
        return res.json({ checkboxes: new Array(CHECKBOX_SIZE).fill(false) })
    })


    server.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`)
    })


}

main()