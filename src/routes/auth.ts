import express, { Request, Response } from 'express'
import { LoginAccessTokenModel } from '../features/auth/models/LoginAccessTokenModel'
import { LoginCreateModel } from '../features/auth/models/LoginCreateModel'
import { LoginMeCheckModel } from '../features/auth/models/LoginMeCheckModel'
import { RegistrationCreateModel } from '../features/auth/models/RegistrationCreateModel'
import { RegistrationEmailResendingModel } from '../features/auth/models/RegistrationEmailResendingModel'
import { authService } from '../features/auth/service'
import { validationEmail, validationLogin, validationLoginOrEmail, validationPassword } from '../features/auth/validations'
import { devicesService } from '../features/security/service'
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer'
import { authenticationRefreshMiddleware } from '../middlewares/authentication-refresh'
import { customRateLimitMiddleware } from '../middlewares/custom-rate-limit'
import { inputValidMiddleware } from '../middlewares/input-valid'
import { usersQRepository } from '../queryRepositories/usersQRepository'
import { blackListTokensRepository } from '../repositories/blackListTokensRepository'
import { ErrorsMessagesType, RequestWithBody } from '../types'
import { genPairJWT, JWTPayload } from '../utils/genJWT'
import { getDeviceInfoByToken, HTTP_STATUSES } from '../utils/helpers'

export const getAuthRouter = () => {
    const router = express.Router()

    router.post('/login',
        customRateLimitMiddleware,
        validationLoginOrEmail(),
        validationPassword(),
        inputValidMiddleware,
        async (req: RequestWithBody<LoginCreateModel>, res: Response<ErrorsMessagesType | LoginAccessTokenModel>) => {
            console.log('/login ====================>')
            const { status, data: userData } = await authService.login(req.body)

            const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress as string
            const useragent = `${req.useragent?.browser} ${req.useragent?.version}`
            const cookieToken = req.cookies.refreshToken

            if (status === 'BadRequest')
                res
                    .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
            else {
                const { deviceId } = await devicesService.createDevice({ ip, title: useragent }, userData?._id.toString() ?? '', cookieToken)

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
            console.log('/registration ====================>')
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
            console.log('/registration-email-resending ====================>')
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
        customRateLimitMiddleware,
        async (req: Request, res: Response<ErrorsMessagesType>) => {
            console.log('/registration-confirmation ====================>')
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
            // const headerAccessToken = (req.headers.authorization || '').split(' ')[1] || '' // 'Xxxxx access token'
            const ip = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress as string
            const useragent = `${req.useragent?.browser} ${req.useragent?.version}`
            const cookieToken = req.cookies.refreshToken

            if (cookieToken)
                await blackListTokensRepository.createBlackToken(cookieToken)

            const { status, data: userData } = await authService.checkUser(req.body)
            console.log(status)
            if (status === 'BadRequest') {
                res
                    .sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
                return
            } else {
                const { deviceId } = await devicesService.createDevice({ ip, title: useragent }, userData?._id.toString() ?? '', cookieToken)
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
            await blackListTokensRepository.createBlackToken(cookieToken)

            const { deviceId } = getDeviceInfoByToken(cookieToken)

            await devicesService.deleteDevice(deviceId, req.body.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
            return
        })

    return router
}