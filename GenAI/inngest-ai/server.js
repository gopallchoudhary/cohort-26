import express from "express";
import 'dotenv/config'
import { inngest } from "./inngest-client.js";
import { serve } from "inngest/express";
import { onOrderPlaced } from "./01-inngest.js";
import { summarizeThenTranslate } from "./02-step-ai.js";



const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

// inngest middleware
app.use('/api/inngest',
    serve({
        client: inngest,
        functions: [onOrderPlaced, summarizeThenTranslate]
    })
)

// hello world
app.get('/', (req, res) => {
    res.send('Hello World!')
})




app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

