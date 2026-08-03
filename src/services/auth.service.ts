import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {UserModel, type IUser} from '../models/user.model.js'

const JWT_SECRET = process.env.JWT_SECRET_VAR || 'super_secret_key_change_me'

export const authService = {
    /**
     * Регистрация нового пользователя
     */
    async register(email: string, password: string): Promise<IUser> {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw new Error('Пользователь с таким email уже существует')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        return await UserModel.create({
            email,
            passwordHash
        })
    },

    /**
     * Аутентификация пользователя и выдача JWT
     */

    async login(email:string, password: string): Promise<{token: string}> {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw new Error('Неверный email или пароль')
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
        if (!isPasswordValid) {
            throw new Error('Неверный email или пароль')
        }

        const token = jwt.sign(
            {id: user._id},
            JWT_SECRET,
            {expiresIn: '24h'}
        );

        return {token}
    }
}