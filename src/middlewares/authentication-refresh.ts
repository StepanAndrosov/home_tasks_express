
import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../utils/helpers"
import { JWTPayload, verifyJWT } from "../utils/genJWT"

export const authenticationRefreshMiddleware = (req: Request, res: Response<JWTPayload>, next: NextFunction) => {

    const token = req.cookies.refreshToken

    console.log(token, '_Middleware')

    const decoded = verifyJWT(token)

    // Verify token is set and correct
    if (decoded?.exp! < Math.floor(Date.now() / 1000)) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
        return
    }

    if (decoded) {
        // Access granted...
        req.body = { ...req.body, ...decoded }
        return next()
    }

    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
}

