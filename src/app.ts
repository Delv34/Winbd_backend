import express from "express"
import mainRouter from "./routes/index.js"

const app = express()
const port: number = 3000;

app.use(express.json())

app.use('/', mainRouter)

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`)
})