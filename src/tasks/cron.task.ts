import cron from 'node-cron'
import { NewsModel } from '../models/news.model.js'
import { notificationService } from '../services/notification.service.js'

/**
 * Запуск фоновой задачи проверкуи отложенных публикаций
 */
export const initTasks = (): void => {
    // '* * * * *' - запускать каждую минуту
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date()
            
            const newsToPublish = await NewsModel.find({status: 'draft', publishAt: {$lte: now}}).select('_id')

            const result = await NewsModel.updateMany({
                status: 'draft',
                publishAt: {$lte: now}
            },
            {
                $set: {status: 'published'}
            }
        )
        if (newsToPublish.length !== 0) {
            for (const news of newsToPublish) {
                notificationService.broadcast('published', news._id.toString()) 
            }
        }
        
            if (result.modifiedCount > 0) {
                console.log(`[Cron] Автоматически опубликовано новостей: ${result.modifiedCount}`)
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`[Cron Error] Ошибка публикации: ${error.message}`)
            } else {
                console.error(`[Cron Error] Неизвестная ошибка публикации`)
            }
        }   
    })
    console.log('[Tasks] Планировщик отложенных публикаций запущен (интервал: 1 минута).')
}