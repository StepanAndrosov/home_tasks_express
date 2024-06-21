import jwt from 'jsonwebtoken'

export interface JWTPayload {
    id: string
    name: string
    iat: number
    exp: number
}

export const genJWT = (newUser: { id: string, name: string }) => {
    return jwt.sign({ id: newUser.id, name: newUser.name, iat: Date.now() }, process.env.JWT_SECRET ?? '', {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

export const verifyJWT = (token: string): JWTPayload | null => {
    let result: JWTPayload | null = null
    jwt.verify(token, process.env.JWT_SECRET ?? '', (err, decoded) => {
        if (err) {
            result = null
        } else {
            result = decoded as JWTPayload
        }
    });
    return result
}

