import jwt from 'jsonwebtoken'

export interface JWTPayload {
    id: string
    name: string
    iat: number
    exp: number
}

export const genJWT = (
    newUser: { id: string, name: string },
    expiresIn: string | number | undefined = process.env.JWT_EXPIRES_IN,
    secret: string | undefined = process.env.JWT_SECRET
) => {
    return jwt.sign({ id: newUser.id, name: newUser.name, iat: Date.now() }, secret ?? '123456', {
        expiresIn
    });
}

export const verifyJWT = (token: string, secret: string | undefined = process.env.JWT_SECRET,): JWTPayload | null => {
    let result: JWTPayload | null = null
    jwt.verify(token, secret ?? '123456', (err, decoded) => {
        if (err) {
            result = null
        } else {
            result = decoded as JWTPayload
        }
    });
    return result
}

