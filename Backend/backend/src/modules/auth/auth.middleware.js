import ApiError from "../../common/utils/api-error";
import { verifyAccessToken } from "../../common/utils/jwt.utils";
import User from '../auth/auth.model.js'

const authenticate = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) throw ApiError.unauthorized("Not Authenticated")

    const decoded = verifyAccessToken(token)
    const user = await User.findById(decoded.id)
    if (!user) throw ApiError.unauthorized("User no longer exists")

    req.user = {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name
    }

    next()
}



const authorize = (...roles) => {
    return (req, res) => {
        if(!roles.includes(req.user.role)) {
            throw ApiError.forbidden("No allowd to perform this action")
        }

        next()
    }
}



export {authenticate, authorize}