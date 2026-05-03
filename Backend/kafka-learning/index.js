import express from "express";
import { Server } from "socket.io";
import http from 'node:http'
import path from "node:path";
import { kafkaClient } from "./kafka-client.js";

async function main() {
    const app = express()
    const PORT = process.env.PORT ?? 8000
    const server = http.createServer(app)
    const io = new Server()
    io.attach(server)

    const kafkaProducer = kafkaClient.producer()
    await kafkaProducer.connect()

    const kafkaConsumer = kafkaClient.consumer()
    await kafkaConsumer.connect()

    await kafkaConsumer.subscribe({
        topics: ['location-updates'],
        fromBeginning: true
    })

    kafkaConsumer.run({
        eachMessage: async (topic, partition, message, heartbeat) => {
            const data = JSON.parse(message.value.toString())
            console.log(`KafkaConsumer Data received: ${data}`);

            io.emit('server-location-updates', {
                id: data.id,
                latitude: data.latitude,
                longitude: data.longitude
            })
            await heartbeat()
        }
    })

    app.use(express.static(path.resolve('public')))


    app.get("/health", (req, res) => {
        return res.json({ healthy: true })
    })

    io.on('connection', async(socket) => {
        console.log(`[Socket]:${socket.id}`)

        socket.on('client:location:update', (locationData) => {
            const { latitude, longitude } = locationData
            console.log(latitude, longitude)
        })

        await kafkaProducer.send({
            topic: 'location-updates',
            messages: [
                {
                    key: socket.id,
                    value: JSON.stringify({ id: socket.id, latitude, longitude })
                }
            ]
        })
    })


    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
}

main()