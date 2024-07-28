import express, { Request, Response } from 'express';
import { HTTP_STATUSES } from '../utils/helpers';
import { authenticationBearerMiddleware } from '../middlewares/authentication-bearer';
import { RequestWithBody } from '../types';
import { JWTPayload } from '../utils/genJWT';
import { deviceQRepository } from '../queryRepositories/devicesQRepository';
import { deviceRepository } from '../repositories/devicesRepository';
import { devicesService } from '../features/security/service';


export const getSecurityRouter = () => {
    const router = express.Router()

    router.get('/devices', authenticationBearerMiddleware, async (req: RequestWithBody<JWTPayload>, res: Response) => {

        const devices = await deviceQRepository.getDevices(req.body.id)
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


    return router
}