import {type Request, type Response, type NextFunction} from 'express'
import jwt, {type JwtPayload} from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET_VAR || 'super_secret_key_change_me'

/**
 * Расширенный интерфейс Request Express,
 * позволяющий безопасно работать со свойством req.user в TS
 */
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string
    }
}

/**
 * Middleware для защиты эндпоинтов. Проверяет наличие и валидность JWT.
 */
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({message: 'Доступ запрещен. Токен отсутствует или неподдерживаемый формат'})
    return
}

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({message: 'Доступ запрещен. Неверный формат заголовка'})
        return
    }

    try {
        // Декодируем токен и вытаскиваем оттуда payload (id пользователя)
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        req.user = {id: decoded.id as string}

        // Передаем управление контроллеру
        next()
    } catch (error: any) {
        res.status(403).json({message: 'Невалидный или просроченный токен'})
    }
}