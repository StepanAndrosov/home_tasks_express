import express, { Request, Response } from 'express'
import { LoginAccessTokenModel } from '../features/auth/models/LoginAccessTokenModel'
import { LoginCreateModel } from '../features/auth/models/LoginCreateModel'
import { LoginMeCheckModel } from '../features/auth/models/LoginMeCheckModel'
import { RegistrationCreateModel } from '../features/auth/models/RegistrationCreateModel'
import { RegistrationEmailResendingModel } from '../features/auth/models/RegistrationEmailResendingModel'
import { authService } from '../features/auth/service'
import { validationEmail, validationLogin, validationLoginOrEmail, validationPassword } from '../features/auth/validations'
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer'
import { authenticationRefreshMiddleware } from '../middlewares/authentication-refresh'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { usersQRepository } from '../queryRepositories/usersQRepository'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { JWTPayload, genPairJWT } from '../utils/genJWT'
import { HTTP_STATUSES } from '../utils/helpers'
import { blackListTokensRepository } from '../repositories/blackListTokensRepository'
import { customRateLimitMiddleware } from '../middlewares/custom-rate-limit'
import { devicesRepository } from '../repositories/devicesRepository'
import { devicesService } from '../features/security/service'
import { randomUUID } from 'crypto'

export const getAuthRouter = () => {
    const router = express.Router()

    router.post('/login',
        customRateLimitMiddleware,
        validationLoginOrEmail(),
        validationPassword(),
        inputValidMiddleware,
        async (req: RequestWithBody<LoginCreateModel>, res: Response<ErrorsMessagesType | LoginAccessTokenModel>) => {

            const { status, data: userData } = await authService.login(req.body)

            const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress as string

            const useragent = `${req.useragent?.browser} ${req.useragent?.version}`

            if (status === 'BadRequest')
                res
                    .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
            else {
                const deviceId = randomUUID()
                await devicesService.createDevice({ ip, title: useragent }, userData?._id!, deviceId)

                const { accessToken, refreshToken } = genPairJWT({ id: userData?._id.toString() ?? '', name: userData?.login ?? '' }, deviceId)

                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, })
                res.json({ accessToken: accessToken })
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
        customRateLimitMiddleware,
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
            if (registreationData.status === 'Success') {
                res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
                return
            }
        })

    router.post('/registration-email-resending',
        customRateLimitMiddleware,
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
            if (registreationData.status === 'Success') {
                res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
                return
            }
        })

    router.post('/registration-confirmation',
        authenticationBearerMiddleware,
        customRateLimitMiddleware,
        async (req: Request, res: Response<ErrorsMessagesType>) => {
            const registreationData = await authService.confirmation(req.body)
            if (registreationData.status === 'BadRequest') {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                    errorsMessages: registreationData.errorMessages ?? []
                })
                return
            }
            if (registreationData.status === 'Success') {
                res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
                return
            }
        })

    router.post('/refresh-token',
        authenticationRefreshMiddleware,
        async (req: RequestWithBody<JWTPayload>, res: Response<ErrorsMessagesType | LoginAccessTokenModel>) => {
            const headerAccessToken = (req.headers.authorization || '').split(' ')[1] || '' // 'Xxxxx access token'

            const cookieToken = req.cookies.refreshToken

            const { deviceId } = JSON.parse(Buffer.from(cookieToken.split('.')[1], 'base64').toString())

            console.log(deviceId, 'deviceId')
            if (cookieToken)
                await blackListTokensRepository.createBlackToken(cookieToken)

            const { status, data: userData } = await authService.refreshToken(headerAccessToken, req.body)
            console.log(status)
            if (status === 'BadRequest') {
                res
                    .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
                return
            } else {
                const { accessToken, refreshToken } = genPairJWT({ id: userData?._id.toString() ?? '', name: userData?.login ?? '' }, deviceId)

                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, })
                res.json({ accessToken: accessToken })
                res.status(HTTP_STATUSES.NO_CONTEND_204)
                return
            }
        })

    router.post('/logout',
        authenticationRefreshMiddleware,
        async (req: RequestWithBody<JWTPayload>, res: Response) => {

            const cookieToken = req.cookies.refreshToken

            await devicesService.deleteDevice(cookieToken, req.body.id)
            if (cookieToken)
                await blackListTokensRepository.createBlackToken(cookieToken)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
            return
        })

    return router
}