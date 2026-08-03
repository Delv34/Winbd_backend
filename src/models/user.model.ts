import {Schema, model, type Document } from "mongoose"

/**
 * Интерфейс, описывающий структуру документа пользователя в базе данных
 * @interface IUser
 * @extends {Document}
 */

export interface IUser extends Document {
    /** Уникальный email (используется как логин) */
    email: string;
    /** Захэшированный пароль */
    passwordHash: string;
    /** Дата и время регистрации пользователя (генерируется автоматически) */
    createdAt: Date;
    /** Дата и время последнего обновления профиля (генерируется автоматически) */
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

/**
 * Mongoose-модель для работы с коллекцией пользователей ('users').
 * Предоставляет методы для поиска, создания, обновления и удаления учётных записей.
 */

export const UserModel = model<IUser>('User', userSchema)