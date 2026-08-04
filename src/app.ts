import express from 'express'
import dotenv from 'dotenv'
import { connnectDB } from './config/db.js';
import globalRouter from './routes/index.js'
import { initTasks } from './tasks/cron.task.js';
import cors from 'cors'
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connnectDB();

initTasks();

app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// Раздача статики: делаем папку uploads доступной извне
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Создаём http-сервер на базе express
const httpServer = createServer(app);

// Инициализация socket.io и настройка cors для него
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

app.use((req, res, next) => {
    req.io = io
    next();
})


// Обработка базовых подключений WebSocket
io.on('connection', (socket) => {
    console.log(`[Server] Пользователь подключился к Websocket: ${socket.id}`)
    
    socket.on('disconnect', () => {
        console.log(`[Server] Пользователь отключился: ${socket.id}`)
    });
});



app.use('/', globalRouter)

httpServer.listen(port, () => {
    console.log(`[Server] Сервер запущен на http://localhost:${port}`)
})