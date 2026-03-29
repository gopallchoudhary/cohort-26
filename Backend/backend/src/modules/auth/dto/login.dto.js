import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto";


class LoginDTO extends BaseDTO {
    static schema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(8).required().message("Password must contain 8 chars")
    })
}

export default LoginDTO