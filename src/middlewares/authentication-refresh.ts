
import { NextFunction, Request, Response } from "express"
import { blackListTokensQRepository } from "../queryRepositories/blackListTokensQRepository"
import { JWTPayload, verifyJWT } from "../utils/genJWT"
import { getDeviceInfoByToken, HTTP_STATUSES } from "../utils/helpers"
import { devicesQRepository } from "../queryRepositories/devicesQRepository"

export const authenticationRefreshMiddleware = async (req: Request, res: Response<JWTPayload>, next: NextFunction) => {

    const token = req.cookies.refreshToken

    const { deviceId } = getDeviceInfoByToken(token)

    const foundedDevice = await devicesQRepository.findDevicesByOneOfTerms([
        { deviceId }
    ])
    if (!foundedDevice[0]) {
        console.log('not founded device')
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }

    const isBlackToken = await blackListTokensQRepository.findBlackToken(token)
    if (isBlackToken) {
        console.log('token blacklisted')
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }

    const decoded = verifyJWT(token)

    // Verify token is set and correct
    if (decoded?.exp! < Date.now()) {
        console.log('token expired')
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }

    if (decoded) {
        // Access granted...
        req.body = { ...req.body, ...decoded }
        return next()
    }

    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
}

