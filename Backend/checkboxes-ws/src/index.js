import express from "express";
import path from "node:path";
import http from 'node:http'
import { Server } from "socket.io";

async function main() {
    const app = express()
    const server = http.createServer(app)
    const PORT = process.env.PORT ?? 8000
    const io = new Server()
    io.attach(server)

    io.on('connection', (socket) => {
        socket.on('client:checkbox:change', (message) => {
            
            io.emit('server:checkbox:change', message)
        })
        
    })


    app.use(express.static(path.resolve('public')))

    app.get('/healthy', (req, res) => res.json({ healthy: true }))


    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })


}

main()