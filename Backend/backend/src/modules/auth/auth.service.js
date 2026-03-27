import ApiError from '../../common/utils/api-error.js'
import { generateAccessToken, generateRefreshTokne, generateResetToken, verifyRefreshToken } from '../../common/utils/jwt.utils.js'
import crypto from 'crypto'
import User from './auth.model.js'

const hashedToken = (token) => crypto.createHash("sha256").update(token).digest("hex")


const register = async ({ name, email, password, role }) => {
    // return user registration
    const existingUser = await User.findOne({ email })
    if (existingUser) throw ApiError.conflict("Email already exists")

    const { rawToken, hashedToken } = generateResetToken()

    const user = await User.create({ name, email, password, role, verificationToken: hashedToken })

    //, send an email to user with token: raw token 
    const userObj = user
    delete userObj.password
    delete userObj.verificationToken

    return userObj
}

const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        throw ApiError.unauthorized("Invalid email or password")
    }

    if (!user.isVerified) {
        throw ApiError.forbidden("User not verified")
    }

    // check password

    const accessToken = generateAccessToken({ id: user._id, email: user.email })
    const refreshToken = generateRefreshTokne({ id: user._id })

    user.refreshToken = hashedToken(refreshToken)
    await user.save({ validateBeforeSave: false })

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    res.cookie("accessToken", accessToken)

    return { user: userObj }
}

const refresh = async (token) => {
    if (!token) throw ApiError("Refresh token is missing")

    const decoded = verifyRefreshToken(token)

    const user = await User.findById(decoded.id).select("+refreshToken")
    if (!user) throw ApiError("User not found")

    if (user.refreshToken !== hashedToken(token)) throw ApiError("Invalid refresh token")

    const accessToken = generateAccessToken({ id: user._id, role: user.role })

    return { accessToken }
}

const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } })
}

const forgotPassword = async (email) => {
    const user = await User.findOne({ email })
    if (!user) throw ApiError.notFound("User not found")
    
    const { rawToken, hashedToken } = generateResetToken()

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000
    await user.save()
}


export { register, login, logout, refresh, forgotPassword }