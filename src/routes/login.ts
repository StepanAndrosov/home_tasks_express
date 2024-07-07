import express, { Response } from 'express'
import { LoginAccessTokenModel } from '../features/auth/models/LoginAccessTokenModel'
import { LoginCreateModel } from '../features/auth/models/LoginCreateModel'
import { LoginMeCheckModel } from '../features/auth/models/LoginMeCheckModel'
import { loginService } from '../features/auth/service'
import { validationLoginOrEmail, validationPassword } from '../features/auth/validations'
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { usersQRepository } from '../queryRepositories/usersQRepository'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { JWTPayload, genJWT } from '../utils/genJWT'
import { HTTP_STATUSES } from '../utils/helpers'

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
                res.status(HTTP_STATUSES.OK_200)
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

    router.post('/registration',
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
                res.status(HTTP_STATUSES.OK_200)
            }
        })

    return router
}