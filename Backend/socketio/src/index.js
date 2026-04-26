import express from "express";
import path from "node:path";
import http from 'node:http'
import { Server } from "socket.io";

async function main() {
    const app = express()
    const server = http.createServer(app)
    const io = new Server()
    io.attach(server)

    const PORT = process.env.PORT ?? 8000

    app.use(express.static(path.resolve('public')))

    // Socket io
    io.on('connection', (socket) => {
        socket.on('user-message', (message) => {
            io.emit('message', message)
        })
    })



    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    })

}

main()