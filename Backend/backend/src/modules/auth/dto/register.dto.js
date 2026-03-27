import BaseDTO from "../../../common/dto/base.dto";
import Joi from "joi";

class RegisterDto extends BaseDTO {
    static schema = Joi.object({
        name: Joi.string().min(2).max(50),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(8).required().message("Password must contain 8 chars"),
        role: Joi.string().valid("customer", "seller").default("customer")
    })
}

export default RegisterDto