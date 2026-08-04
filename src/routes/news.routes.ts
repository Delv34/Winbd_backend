import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { newsController } from "../controllers/news.controller.js";

const router = Router();

router.use(authMiddleware);

router.post('/create', newsController.create)
router.get('/', newsController.getAll)
router.get('/drafts', newsController.getDrafts)
router.put('/:id', newsController.update)
router.delete('/:id', newsController.delete)

export default router