
import Redis from "ioredis";

async function clear() {
    const redis = new Redis()
    await redis.flushdb()
    console.log('cleared');

}

clear()