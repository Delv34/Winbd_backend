import mongoose from "mongoose";

/**
 * Функция для инициализации подключения к MongoDB.
 * Использует перемунную окружения MONGODB_URI.
 * 
 * @returns {Promise<void>}
 */
export const connnectDB = async (): Promise<void> => {
    try {
        const mongodbUri = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@localhost:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin` 
        
        mongoose.set('strictQuery', true)

        const conn = await mongoose.connect(mongodbUri)

        console.log(`[Database] успешное подключение к MongoDB: ${conn.connection.host}`)
    } catch (error) {
        if (error instanceof Error) {
            console.error(`[Database Error] Ошибка подключения к базе данных: ${error.message}`)
        } else {
            console.error(`[Database Error] Произошла неизвестная ошибкуа при подключении к БД`)
        }
        process.exit(1)
    }
}