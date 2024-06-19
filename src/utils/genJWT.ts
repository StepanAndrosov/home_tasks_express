import jwt from 'jsonwebtoken'

export const genJWT = (newUser: { id: string, name: string }) => {
    return jwt.sign({ id: newUser.id, name: newUser.name, iat: Date.now() }, process.env.JWT_SECRET ?? '', {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

