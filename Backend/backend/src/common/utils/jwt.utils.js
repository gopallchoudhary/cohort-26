import crypto from 'crypto'
import jwt from 'jsonwebtoken'

const generateResetToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

    return { rawToken, hashedToken }
}

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN || '15m' })
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_ACCESS_SECRET)
}


const generateRefreshTokne = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESGH_EXPIRES_IN || '24h' })
}

const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_SECRET)
}


export { generateResetToken, generateAccessToken, verifyAccessToken, generateRefreshTokne, verifyRefreshToken }
