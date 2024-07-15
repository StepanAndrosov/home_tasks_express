import express, { Response } from 'express'
import { LoginAccessTokenModel } from '../features/auth/models/LoginAccessTokenModel'
import { LoginCreateModel } from '../features/auth/models/LoginCreateModel'
import { LoginMeCheckModel } from '../features/auth/models/LoginMeCheckModel'
import { RegistrationCreateModel } from '../features/auth/models/RegistrationCreateModel'
import { authService } from '../features/auth/service'
import { validationCode, validationEmail, validationLogin, validationLoginOrEmail, validationPassword } from '../features/auth/validations'
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { usersQRepository } from '../queryRepositories/usersQRepository'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { JWTPayload, genJWT } from '../utils/genJWT'
import { HTTP_STATUSES } from '../utils/helpers'
import { RegistrationEmailResendingModel } from '../features/auth/models/RegistrationEmailResendingModel'
import { ConfirmationModel } from '../features/auth/models/ConfirmationModel'

export const getAuthRouter = () => {
    const router = express.Router()

    router.post('/login',
        validationLoginOrEmail(),
        validationPassword(),
        inputValidMiddleware,
        async (req: RequestWithBody<LoginCreateModel>, res: Response<ErrorsMessagesType | LoginAccessTokenModel>) => {
            const { isCompare, user } = await authService.login(req.body)
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
        validationLogin(),
        validationEmail(),
        validationPassword(),
        inputValidMiddleware,
        async (req: RequestWithBody<RegistrationCreateModel>, res: Response<ErrorsMessagesType>) => {
            const registreationData = await authService.registration(req.body)
            if (registreationData.status === 'BadRequest') {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                    errorsMessages: registreationData.errorMessages ?? []
                })
                return
            }
            if (registreationData.status === 'Success')
                res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.post('/registration-email-resending',
        validationEmail(),
        inputValidMiddleware,
        async (req: RequestWithBody<RegistrationEmailResendingModel>, res: Response<ErrorsMessagesType>) => {
            const registreationData = await authService.emailResending(req.body)
            if (registreationData.status === 'BadRequest') {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                    errorsMessages: registreationData.errorMessages ?? []
                })
                return
            }
            if (registreationData.status === 'Success')
                res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.post('/registration-confirmation',
        validationCode(),
        inputValidMiddleware,
        async (req: RequestWithBody<ConfirmationModel>, res: Response<ErrorsMessagesType>) => {
            const registreationData = await authService.confirmation(req.body)
            if (registreationData.status === 'BadRequest') {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                    errorsMessages: registreationData.errorMessages ?? []
                })
                return
            }
            if (registreationData.status === 'Success')
                res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    return router
}