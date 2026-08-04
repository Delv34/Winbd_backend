import express from 'express'
import { upload } from '../middlewares/upload.middleware.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { mediaController } from '../controllers/media.controller.js'

const router = express.Router()

//Эндпоинт, куда wysiwyg редактор будет отправлять картинки, в процессе написания текста
router.post('/upload', authMiddleware, upload.single('image'), mediaController.uploadImage)
router.delete('/:filename', authMiddleware, mediaController.deleteImage)

export default router;