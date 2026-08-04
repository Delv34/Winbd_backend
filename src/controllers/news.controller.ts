import { type Response } from 'express'
import { type AuthenticatedRequest } from '../middlewares/auth.middleware.js'
import { newsService } from '../services/news.service.js'
import { notificationService } from '../services/notification.service.js'

export const newsController = {
    async create (req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { title, content, publishAt } = req.body
            const authorId = req.user!.id // Восклицательный знак говорит TS, что user точно есть благодаря middleware

            if (!title || !content) {
                res.status(400).json({message: 'Заголовок и содержание обязательны'})
                return
            }

            const news = await newsService.create(title, content, authorId, publishAt)
            notificationService.broadcast('created', news._id.toString())
            res.status(200).json(news)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({message: error.message})
            } else {
                res.status(500).json({message: 'Произошла непредвиденная ошибка при создании новости'})
            }
        }
    },

    async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const news = await newsService.getAllPublished();
            res.status(200).json(news)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({message: error.message})
            } else {
                res.status(500).json({message: 'Произошла непредвиденная ошибка при получении новостей'})
            }
        }
    },

    async getDrafts(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const authorId = req.user!.id
            const news = await newsService.getUserDrafts(authorId);
            res.status(200).json(news)
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({message: error.message})
            } else {
                res.status(500).json({message: 'Произошла непредвиденная ошибка при получении черновиков'})
            }
        }
    },

    async update(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const authorId = req.user!.id

            if (!id || typeof id !== 'string') {
                res.status(400).json({message: 'Неверный или отсутствующий ID новости'})
                return
            }

            const updatedNews = await newsService.update(id, authorId, req.body)
            notificationService.broadcast('updated', updatedNews._id.toString())
            res.status(200).json(updatedNews)
        } catch (error) {
            if (error instanceof Error) {
                const status = error.message.includes('прав') ? 403 : 404
                res.status(status).json({message: error.message})
            } else {
                res.status(500).json({message: 'Внутренняя ошибка сервера при обновлении новости'})
            }
        }
    },

    async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const {id} = req.params
            const authorId = req.user!.id

            if (!id || typeof id !== 'string') {
                res.status(400).json({message: 'Неверный или отсутствующий ID новости'})
                return
            }

            await newsService.delete(id, authorId);
            notificationService.broadcast('deleted', id)
            res.status(200).json({message: 'Новость успешно удалена'})
        } catch (error) {
            if (error instanceof Error) {
                const status = error.message.includes('прав') ? 403 : 404
                    res.status(status).json({message: error.message})
                } else {
                     res.status(500).json({message: 'Внутренняя ошибка сервера при удалении новости'})
                }
        }
    }

}