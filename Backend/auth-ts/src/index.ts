import { createApplication } from "./app/index.js";
import { createServer } from "node:http";

async function main() {
    try {
        const server = createServer(createApplication());
        server.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        throw error
    }
}

main()