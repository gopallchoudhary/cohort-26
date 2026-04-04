import jwt from 'jsonwebtoken'

export interface UserTokenPayload {
    id: string
}

const JWT_SECRET = "dkljf9238urdfd"

export function createUserToken(payload: UserTokenPayload) {
    return jwt.sign(payload, JWT_SECRET)
}

export function verifyUserToken(token: string) {
    try {
        return  jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}