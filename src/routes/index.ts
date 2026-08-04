import {Router} from 'express'
import newsRouter from './news.routes.js'
import authRouter from './auth.routes.js'
import mediaRouter from './media.routes.js'

const globalRouter = Router();

globalRouter.use('/auth', authRouter)
globalRouter.use('/news', newsRouter)
globalRouter.use('/media', mediaRouter)
// router.get('/', (req: Request, res: Response) => {
//     res.send('Главная страница')
// })

export default globalRouter;