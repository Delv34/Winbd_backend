import { type AuthenticatedRequest } from "../middlewares/auth.middleware.js"
import { type Response } from "express"
import { mediaService } from "../services/media.service.js"

export const mediaController = {
    async uploadImage(req: AuthenticatedRequest, res: Response): Promise<void> {
        if (!req.file) {
            res.status(400).json({message: 'Файл не был загружен'})
            return
        }

        const url = mediaService.generateFileUrl(req, req.file.filename)
        res.status(201).json({url})
    },

    async deleteImage(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const filename = req.params.filename
            if (typeof filename !== 'string') {
                res.status(400).json({message: 'Недопустимое имя файла'})
                return
            }
            await mediaService.deleteFile(filename)
            res.status(200).json({message: 'Файл удалён'})
        } catch (error) {
            if (error instanceof Error) {
                const status = error.message.includes('не найден') ? 404 : 400
                    res.status(status).json({message: error.message})
                } else {
                     res.status(500).json({message: 'Внутренняя ошибка сервера при удалении файла'})
                }
        }
    }
}