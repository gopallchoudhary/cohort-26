const http = require("http")

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/menu') {
        res.writeHead(200, { "content-type": "application/json" })
        res.end(JSON.stringify({ items: ['thali', 'biryani'] }))
    } else if (req.method === 'POST' && req.url === '/order') {
        let data = ''
        req.on('data', data += chunk)
        req.on('end', () => {
            const order = JSON.parse(data)
            res.end()
        })
    }
})