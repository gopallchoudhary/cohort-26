import http from 'http'
import { createServerApplication } from './app/index.js'
import { env } from './env.js'


async function main() {
    try {
        const server = http.createServer(createServerApplication())
        const PORT: number = env.PORT ? +env.PORT : 3000

        server.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
            
        })
    } catch (error) {
        throw error
    }
}

main()