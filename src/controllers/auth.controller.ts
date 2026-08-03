import {type Request, type Response} from 'express'
import {authService} from '../services/auth.service.js'

export const authController = {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const {email, password} = req.body
            
            if (!email || !password) {
                res.status(400).json({message: 'Поля email и password обязательны'})
                return
            }

            const newUser = await authService.register(email, password);

            res.status(201).json({
                id: newUser._id,
                email: newUser.email
            });
        } catch (error) {
            // Проверяем, что ошибка — это стандартный объект Error, у которого точно есть поле message
            // Потому что нельзя писать error: any
            if (error instanceof Error) {
                res.status(400).json({message: error.message})
            } else {
                res.status(400).json({message: 'Произошла непредвиденная ошибка при регистрации'})
            }
    }
    },

    async login(req: Request, res: Response): Promise<void> {
        try {
            const {email, password} = req.body
            
            if (!email || !password) {
                res.status(400).json({message: 'Поля email и password обязательны'})
                return
            }

            const result = await authService.login(email, password)
            res.status(200).json(result)
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({message: error.message})
            } else {
                res.status(401).json({message: 'Произошла непредвиденная ошибка при авторизации'})
            }
        }
    }
}