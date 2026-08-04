import path from "path"
import { promises } from "fs"
import {type Request } from "express"

export const mediaService = {
    /**
     * Собирает абсолютный URL загруженного файла
     */
    generateFileUrl(req: Request, filename:string): string {
        return `${req.protocol}://${req.get('host')}/uploads/${filename}`
    },
    
    /** Удаляет файл с диска */
    async deleteFile(filename: string): Promise<void> {
        const safeName = path.basename(filename)

        if (safeName !== filename) throw new Error('Недопустимое имя файла')

            const filePath = path.join(process.cwd(), 'uploads', safeName)

        try {
            await promises.access(filePath)
        } catch {
            throw new Error('Файл не найден')
        }

        await promises.unlink(filePath)
    }
}