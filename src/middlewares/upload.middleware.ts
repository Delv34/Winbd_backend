import multer, {type FileFilterCallback} from "multer";
import { type Request } from "express";
import path from "path";

/**
 * Конфигурация Multer для локального сохранения файлов.
 */
const storage = multer.diskStorage({    
    // Определяет папку для сохранения файлов
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    // Генерирует уникальное имя файла для избежания перезаписи
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // Получаем оригинальное расширение
        const ext = path.extname(file.originalname)
        cb(null,`${file.fieldname}-${uniqueSuffix}${ext}`)
    }
});

/**
 * Фильтр для проверки типа загружаемых файлов
 */
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb (new Error('Разрешены только изображения формата (jpeg, jpg, png, gif)'))
    }
}

// Экспортируем настроенный middleware
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5  * 1024 * 1024} // Лимит 5 Мб
})