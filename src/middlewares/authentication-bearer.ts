
import { Request, Response } from "express"
import { HTTP_STATUSES } from "../utils/helpers"
import { JWTPayload, verifyJWT } from "../utils/genJWT"

export const authenticationBearerMiddleware = (req: Request, res: Response<JWTPayload>) => {

    // parse token from headers
    const title = (req.headers.authorization || '').split(' ')[0] || '' // 'Bearer xxxx'
    const token = (req.headers.authorization || '').split(' ')[1] || '' // 'Xxxxx access token'

    const decoded = verifyJWT(token)

    // Verify token is set and correct

    if (decoded && title === 'Bearer') {
        // Access granted...
        return res.json(decoded)
    }

    res.status(HTTP_STATUSES.NOT_AUTHORIZED_401)
}

