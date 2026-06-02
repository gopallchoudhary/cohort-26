import { inngest } from "./inngest-client.js";


export const onOrderPlaced = inngest.createFunction(
    {
        id: 'on-order-placed',
        retries: 2,
        triggers: [{event: 'chai.on.order.placed'}]
    },

    async({event, step}) => {
        const {orderId, customer} = event.data 

        const greeting = await step.run('greeting', async() => {
            return `Thank you ${customer.name}! for ordering ${orderId}`
        })

        // async function logGreeting() {
        //     console.log(greeting);
        // } //. this is blunder, not durable and not cached 

        await step.run('log-greeting', async() => {
            console.log(greeting);
        })

        return {ok: true, greeting}
    }
)