
import { NextFunction, Request, Response } from "express"
import { HTTP_STATUSES } from "../utils"
// admin\qwerty.
const authTitle = 'Basic'
const auth = { login: 'admin', password: 'qwerty' }

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {

    // parse login and password from headers
    const title = (req.headers.authorization || '').split(' ')[0] || '' // 'Basic xxxx'
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '' // 'Xxxxx login:password'
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':') // decoded login:password
    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password && title === authTitle) {
        // Access granted...
        return next()
    }

    res.status(HTTP_STATUSES.NOT_AUTHORIZED_401).send('Authentication required.')
}

