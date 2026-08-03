import {Schema, model, type Document, type Types} from "mongoose"

/**
 * Возможные статусы публикации новостной статьи.
 * - 'draft': Черновик, не виден в общей ленте.
 * - 'published': Опубликованная статья, доступная всем.
 */

export type NewsStatus = 'draft' | 'published'

/**
 * Интерфейс, описывающий структуру документа новостной статьи.
 * @interface INews
 * @extends {Document}
 */
export interface INews extends Document {
    /** Заголовок новостной статьи */
    title: string;
    /** Полное текстовое содержание (тело) новости */
    content: string;
    /** Идентификатор пользователя-автора статьи (ссылка на коллекцию 'users') */
    author: Types.ObjectId;
    /** Текущий статус публикации новости */
    status: NewsStatus;
    /** Дата и время запланированной или фактической публикации */
    publishAt: Date;
    /** Дата создания в системе */
    createdAt: Date;
    /** Жаьа последнего редактирования новости */
    updatedAt: Date;
}

const newsSchema = new Schema<INews>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    publishAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
})

newsSchema.index({status: 1, publishAt: 1})

/**
 * Mongoose-модель для рабосы с коллекцией новостей ('news').
 * Используется для создания статей, CRUD-операций авторизованных авторов
 * и автоматической публикации через cron-задачи.
 */

export const NewsModel = model<INews>('News', newsSchema)