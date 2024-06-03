import express, { Request, Response } from 'express'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { HTTP_STATUSES } from '../utils/helpers'
import { LoginCreateModel } from '../features/login/models/LoginCreateModel'

export const getLoginRouter = () => {
    const router = express.Router()

    router.post('/',
        inputValidMiddleware,
        async (req: RequestWithBody<LoginCreateModel>, res: Response<ErrorsMessagesType>) => {

            res
                .sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })
}