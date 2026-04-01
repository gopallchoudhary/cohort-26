import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto.js";


class LoginDTO extends BaseDTO {
    static schema = Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().required()
    })
}

export default LoginDTO