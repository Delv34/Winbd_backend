import { type Server } from "socket.io";

let io: Server | null = null

export const notificationService = {
    /** Инилиализация сокет-сервера (вызывается один раз в app.ts) */
    init (server: Server): void {io = server},
    /** Оповещение клиентов о событиях с новостями */
    broadcast(type: 'created' | 'updated' | 'deleted' | 'published', newsId: string): void {
        io?.emit('news:event', {type, newsId, timestamp: new Date().toISOString()})
    }
}