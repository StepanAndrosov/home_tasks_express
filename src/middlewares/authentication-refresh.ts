
import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../utils/helpers"
import { JWTPayload, verifyJWT } from "../utils/genJWT"
import { blackListTokensQRepository } from "../queryRepositories/blackListTokensQRepository"

export const authenticationRefreshMiddleware = async (req: Request, res: Response<JWTPayload>, next: NextFunction) => {

    const token = req.cookies.refreshToken

    console.log(token)

    const isBlackToken = await blackListTokensQRepository.findBlackToken(token)
    if (isBlackToken) {
        // check black list 
        console.log('token blacklisted')
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
        return
    }

    const decoded = verifyJWT(token)

    // Verify token is set and correct
    if (decoded?.exp! < Date.now()) {
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

