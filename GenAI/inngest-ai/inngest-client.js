import { Inngest } from "inngest";
import {openaiResponses} from '@inngest/ai/models'


export const inngest = new Inngest({
    id: 'inngest-ai'
})

export const gpt4omini = new openaiResponses({
    model: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY
})