import * as authService from "./auth.service"
import ApiResponse from "../../common/utils/api-response"

const register = async (req, res) => {
    // do something
    const user = await authService.register(req.body)
    ApiResponse.created(res, "Registration success", user)

}

const login = async (req, res) => {
    const user = await authService.login(req.body)
    
}



export { register }