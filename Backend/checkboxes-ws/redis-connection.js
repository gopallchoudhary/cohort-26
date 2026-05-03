import Redis from "ioredis";


function createRedisConnection() {
    return new Redis(process.env.REDIS_URL, {maxRetriesPerRequest: 1})
}


export const redis = createRedisConnection() // just for reads and writes

export const publisher = createRedisConnection()
export const subscriber = createRedisConnection()

