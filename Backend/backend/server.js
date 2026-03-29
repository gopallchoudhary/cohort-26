import app from "./src/app.js";
import "dotenv/config"

const PORT = process.env.PORT || 4000


const start = async () => {
    // connect DB

    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT} in ${process.env.NODE_ENV}`);
    })
}

start().catch((err) => {
    console.log(err);
    process.exit(1)
})