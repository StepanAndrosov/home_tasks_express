import express, { Request, Response } from 'express'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { HTTP_STATUSES } from '../utils/helpers'
import { LoginCreateModel } from '../features/login/models/LoginCreateModel'
import { validationLoginOrEmail, validationPassword } from '../features/login/validations'
import { loginService } from '../features/login/service'

export const getLoginRouter = () => {
    const router = express.Router()

    router.post('/',
        validationLoginOrEmail(),
        validationPassword(),
        inputValidMiddleware,
        async (req: RequestWithBody<LoginCreateModel>, res: Response<ErrorsMessagesType>) => {
            const isLogin = await loginService.login(req.body)
            if (!isLogin)
                res
                    .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
            else
                res
                    .sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}