import express, { Request, Response } from 'express';
import { devicesService } from '../features/security/service';
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer';
import { deviceQRepository } from '../queryRepositories/devicesQRepository';
import { RequestWithBody } from '../types';
import { JWTPayload } from '../utils/genJWT';
import { HTTP_STATUSES } from '../utils/helpers';


export const getSecurityRouter = () => {
    const router = express.Router()

    router.get('/devices', authenticationBearerMiddleware, async (req: RequestWithBody<JWTPayload>, res: Response) => {

        const devices = await deviceQRepository.getUserDevices(req.body.id)
        res.json(devices)
        res.status(HTTP_STATUSES.OK_200)
    })

    router.delete('/devices',
        authenticationBearerMiddleware,
        async (req: RequestWithBody<JWTPayload>, res: Response) => {

            const refreshToken = req.cookies.refreshToken

            await devicesService.deleteDevices(refreshToken, req.body.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })

    router.delete('/devices/:deviceId',
        authenticationBearerMiddleware,
        async (req: Request, res: Response) => {

            const refreshToken = req.cookies.refreshToken

            const { status } = await devicesService.deleteDevice(refreshToken, req.body.id)

            if (status === 'BadRequest')
                res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            if (status === 'Forbidden')
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
            else
                res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
        })


    return router
}