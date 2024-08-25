import express, { Request, Response } from 'express';
import { devicesService } from '../features/security/service';
import { authenticationRefreshMiddleware } from '../middlewares/authentication-refresh';
import { devicesQRepository } from '../queryRepositories/devicesQRepository';
import { RequestWithBody } from '../types';
import { JWTPayload } from '../utils/genJWT';
import { HTTP_STATUSES } from '../utils/helpers';


export const getSecurityRouter = () => {
    const router = express.Router()

    router.get('/devices', authenticationRefreshMiddleware, async (req: RequestWithBody<JWTPayload>, res: Response) => {

        const devices = await devicesQRepository.getUserDevices(req.body.id)
        res.json(devices)
        res.status(HTTP_STATUSES.OK_200)
    })

    router.delete('/devices',
        authenticationRefreshMiddleware,
        async (req: RequestWithBody<JWTPayload>, res: Response) => {

            const refreshToken = req.cookies.refreshToken

            await devicesService.deleteDevices(refreshToken, req.body.id)

            res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
            return
        })

    router.delete('/devices/:deviceId',
        authenticationRefreshMiddleware,
        async (req: Request, res: Response) => {

            const { status } = await devicesService.deleteDevice(req.params.deviceId, req.body.id)

            if (status === 'BadRequest') {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }
            if (status === 'Forbidden') {
                res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
                return
            }
            else {
                res.sendStatus(HTTP_STATUSES.NO_CONTEND_204)
                return
            }
        })


    return router
}