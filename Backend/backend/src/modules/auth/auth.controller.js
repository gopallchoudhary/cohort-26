import * as authService from "./auth.service.js"
import ApiResponse from "../../common/utils/api-response.js"



const register = async (req, res) => {
    // do something
    const user = await authService.register(req.body)
    ApiResponse.created(res, "Registration success", user)

}

const login = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body)

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    ApiResponse.ok(res, "Login successfully", { user, accessToken })
}

const refreshToken = async (req, res) => {
    const { accessToken } = await authService.refresh(req.cookies?.refreshToken)
    ApiResponse.ok(res, "Token refreshed successfully", { accessToken })


}

const logout = async (req, res) => {
    await authService.logout(req.user.id)
    res.clearCookie("refreshToken")
    ApiResponse.ok(res, "Logout successfully")
}

const verifyEmail = async (req, res) => {
    await authService.verifyEmail(req.params.token)
    ApiResponse.ok(res, "Email verified successfully")
}


const forgotPassword = async (req, res) => {
    await authService.forgotPassword(req.body.email)
    ApiResponse.ok(res, "Reset password email sent")
}


const resetPassword = async (req, res) => {
    await authService.resetPassword(req.params.token, req.body.password)
    ApiResponse.ok(res, "Password reset successfully")
}


const getMe = async (req, res) => {
    const user = await authService.getMe(req.user.id)
    ApiResponse.ok(res, "User Profile", user)
}



export { register, login, logout, refreshToken, verifyEmail, forgotPassword, resetPassword, getMe }