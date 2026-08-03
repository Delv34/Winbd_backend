import {NewsModel, type INews, type NewsStatus} from '../models/news.model.js';
import {type Types} from 'mongoose';

export const newsService = {
    /**
     * Создает новую новость.
     * Если дата publishAt находится в будущем, статус автоматически проставляется как 'draft' (отложенная публикация)
     */
    async create(title: string, content:string, authorId: string, publishAt?: string): Promise<INews> {
        const parsedDate = publishAt ? new Date(publishAt) : new Date()

        // Если дата публикации в будущем - то новость становится черновиком для отложенной публикации
        const status: NewsStatus = parsedDate > new Date() ? 'draft' : "published"

        return await NewsModel.create({
            title,
            content,
            author: authorId,
            publishAt: parsedDate,
            status
        });
    },

    /**
     * Получает список всех новостей, которые уже опубликованы
     */
    async getAllPublished(): Promise<INews[]> {

        const query = NewsModel.find()
        return (await NewsModel.find({status: 'published' }).sort({ publishAt: -1}))
    },

    /**
     * Редактирует новость, только если запрос делает её автор
     */
    async update(newsId: string, authorId: string, updateData: {
        title?: string,
        content?: string,
        publishAt?: string
    }): Promise<INews> {
        const news = await NewsModel.findById(newsId)
        
        if (!news) throw new Error('Новость не найдена')

        // Проверка прав: сравниваем ID автора новости и ID текущего пользователя
        if(news.author.toString() !== authorId) {
            throw new Error('У вас неу прав на редактирование этой новости')
        }

        // Если обновляется дата публикации, пересчитываем статус
        if (updateData.publishAt) {
            const parsedDate = new Date(updateData.publishAt);
            news.publishAt = parsedDate;
            news.status = parsedDate > new Date() ? 'draft' : 'published';
        }

        if (updateData.title) news.title = updateData.title
        if (updateData.content) news.content = updateData.content
        

        return await news.save()
    },

    /**
     * Удаляет новость с проверкой авторства
     */

    async delete(newsId: string, authorId: string): Promise<void> {
        const news = await NewsModel.findById(newsId)

        if (!news) throw new Error('Новость не найдена')
        if (news.author.toString() !== authorId) {
            throw new Error('У вас нет прав на удаление этой новости')
        }

        await news.deleteOne();
    }
}