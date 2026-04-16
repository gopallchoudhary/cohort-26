import ApiError from '../../common/utils/api-error.js'
import { generateAccessToken, generateRefreshTokne, generateResetToken, verifyRefreshToken } from '../../common/utils/jwt.utils.js'
import crypto from 'crypto'
import User from './auth.model.js'
import { sendResetPasswordEmail, sendVerificationEmail } from '../../common/config/email.js'

const hashedToken = (token) => crypto.createHash("sha256").update(token).digest("hex")


const register = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ email })

    if (existingUser) throw ApiError.conflict("User already registered")

    const { rawToken, hashedToken } = generateResetToken()

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken: hashedToken
    })

    // send verification email
    try {
        await sendVerificationEmail(email, rawToken)
    } catch (error) {
        console.error("Failed to send verification email:", err.message);
    }

    const userObj = user
    delete userObj.password
    delete userObj.verificationToken

    return userObj
}


const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select("+password")
    if (!user) throw ApiError.notFound("Invalid email or password")

    const isPasswordCorrect = user.comparePassword(password)

    if (!isPasswordCorrect) throw ApiError.unauthorized("Ivalid email or password")

    if (!user.isVerified) throw ApiError.forbidden("Please verify your email before logging in")

    const accessToken = generateAccessToken({ id: user._id, email: user.email, role: user.role })
    const refreshToken = generateRefreshTokne({ id: user._id })

    user.refreshToken = hashedToken(refreshToken)
    await user.save({ validateBeforeSave: false })

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken


    return { user: userObj, accessToken, refreshToken }
}


const refresh = async (token) => {
    if (!token) throw ApiError.unauthorized("Refresh token missing")

    const decoded = verifyRefreshToken(token)

    const user = await User.findById(decoded.id).select("+refreshToken")
    if (!user) throw ApiError.unauthorized("Invalid refresh token")

    const hashedToken = hashedToken(token)

    if (hashedToken !== user.refreshToken) throw ApiError.unauthorized("Invalid refresh token")

    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role })

    return { accessToken }
}


const logout = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshToken: null })
}


const verifyEmail = async (token) => {
    const trimmed = String(token).trim("")
    if (!trimmed) throw ApiError.unauthorized("Invalid or expired refresht token")
    const hashed = hashedToken(token)

    let user = await User.findOne({ verificationToken: trimmed }).select("+verificationToken")
    if (!user) {
        user = await User.findOne({ verificationToken: hashed }).select("+verificationToken")
    }

    if (!user) throw ApiError.unauthorized("Invalid or expired verification token")

    await User.findByIdAndUpdate(user._id, {
        $set: { isVerified: true },
        $unset: { verificationToken: 1 }
    })

    return user
}


const forgotPassword = async (email) => {
    const user = await User.findOne({ email })
    if (!user) throw ApiError.notFound("Account not found with the email")

    const { rawToken, hashedToken } = generateResetToken()

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save()

    // send reset password email
    try {
        await sendResetPasswordEmail(email, rawToken)
    } catch (error) {
        console.error("Failed to send reset email:", err.message);
    }
}

const resetPassword = async (token, newPassword) => {
    const hashed = hashedToken(token)

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    }).select("+resetPasswordToken +resetPasswordExpires")

    if (!user) throw ApiError.badRequest("Invalid or expired reset token")

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
}

const getMe = async (userId) => {
    const user = await User.findById(userId)

    if (!user) throw ApiError.notFound("User not found")
    return user
}

export { register, login, logout, refresh, forgotPassword, getMe, resetPassword, verifyEmail }