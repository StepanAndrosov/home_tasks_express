
import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../utils/helpers"
import { JWTPayload, verifyJWT } from "../utils/genJWT"

export const authenticationBearerMiddleware = (req: Request, res: Response<JWTPayload>, next: NextFunction) => {

    // parse token from headers
    const title = (req.headers.authorization || '').split(' ')[0] || '' // 'Bearer xxxx'
    const token = (req.headers.authorization || '').split(' ')[1] || '' // 'Xxxxx access token'

    const decoded = verifyJWT(token)

    // Verify token is set and correct

    if (decoded?.exp ?? Date.now() < Date.now()) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
        return
    }

    if (decoded && title === 'Bearer') {
        // Access granted...
        req.body = { ...req.body, ...decoded }
        return next()
    }

    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    return
}

