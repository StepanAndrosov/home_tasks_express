import express, { Request, Response } from 'express'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { HTTP_STATUSES } from '../utils/helpers'
import { LoginCreateModel } from '../features/login/models/LoginCreateModel'
import { validationLoginOrEmail, validationPassword } from '../features/login/validations'
import { loginService } from '../features/login/service'
import { JWTPayload, genJWT, verifyJWT } from '../utils/genJWT'
import { LoginAccessTokenModel } from '../features/login/models/LoginAccessTokenModel'
import { LoginMeCheckModel } from '../features/login/models/LoginMeCheckModel'
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer'
import { usersQRepository } from '../queryRepositories/usersQRepository'

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

                res.json({ accessToken: jwt })
                res.status(HTTP_STATUSES.NO_CONTEND_204)
            }
        })

    router.get('/me',
        authenticationBearerMiddleware,
        async (req: RequestWithBody<JWTPayload>, res: Response<LoginMeCheckModel>) => {
            const user = await usersQRepository.findUserById(req.body.id)
            if (!user) {
                res
                    .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
            }

            else {
                res.json({ email: user.email, login: user.login, userId: user.id })
                res.status(HTTP_STATUSES.OK_200)
            }
        })


    return router
}