const express = require('express');


function block_1_basicServer() {
    return new Promise((resolve) => {
        const app = express();
        app.get('/menu', (req, res) => {
            res.json({
                items: [{ thali: 'biryani' }, { 'pizza': 'cheese' }, { 'burger': 'kebab' }]
            });
        });

        app.get('/search', (req, res) => {
            const { q, limit } = req.query
            res.json({
                query: q,
                limit: limit || '10'
            })
        })


        app.get('menu/:id', (req, res) => {
            const { id } = req.params
            res.json({
                item: id,
                price: 10
            })
        })

        app.post('/order', (req, res) => {
            const order = req.body
            res.status(201).json({
                status: 'created',
                order
            })
        })

        const server = app.listen(0, async () => { // 0 is signal for assigning any free port
            console.log(server);

            const port = server.address().port
            const base = `http://127.0.0.1:${port}`

            try {
                const menuRes = await fetch(`${base}/menu`)
                const menuData = menuRes.json()
                console.log(JSON.stringify(menuData))
                console.log("+++++++++++++++++++++++");

                const searchMenu = await fetch(`${base}/searchq=biryani&limit=5`)
                const searchData = searchMenu.json()
                console.log(JSON.stringify(searchData))
                console.log("++++++++++++++++++++++++++++")



                const menuItemRes = await fetch(`${base}/menu/42`)
                const menuItemData = await menuItemRes.json()
                console.log(JSON.stringify(menuItemData))
                console.log("+++++++++++++++++++++++++++");

                const orderRes = await fetch(`${base}/order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'Application/json',
                        body: JSON.stringify({

                        })
                    }
                })




            } catch (error) {
                console.log(error);

            }

        })

        server.close(() => {
            console.log("Block 1 served");
            process.exit(0)
        })
    })
}


function block_2_response() {

}


async function main() {
    await block_1_basicServer()
    await block_2_response()
    process.exit(0)
}

main()