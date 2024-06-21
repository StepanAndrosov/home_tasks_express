import express, { Request, Response } from 'express'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { HTTP_STATUSES } from '../utils/helpers'
import { LoginCreateModel } from '../features/login/models/LoginCreateModel'
import { validationLoginOrEmail, validationPassword } from '../features/login/validations'
import { loginService } from '../features/login/service'
import { genJWT } from '../utils/genJWT'
import { LoginAccessTokenModel } from '../features/login/models/LoginAccessTokenModel'

export const getAuthRouter = () => {
    const router = express.Router()

    router.post('/login',
        validationLoginOrEmail(),
        validationPassword(),
        inputValidMiddleware,
        async (req: RequestWithBody<LoginCreateModel>, res: Response<ErrorsMessagesType | LoginAccessTokenModel>) => {
            const { isCompare, user } = await loginService.login(req.body)
            if (!isCompare)
                res
                    .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
            else {

                const jwt = genJWT({ id: user.id?.toString() ?? '', name: user.name ?? '' })

                console.log(jwt)

                res.json({ accessToken: jwt })
                res.status(HTTP_STATUSES.NO_CONTEND_204)
            }
        })

    return router
}