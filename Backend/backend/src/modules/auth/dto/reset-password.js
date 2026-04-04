import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto.js";


class ResetPasswordDTO extends BaseDTO {
    static schema = Joi.object({
        password: Joi.string()
            .min(8)
            .pattern(/(?=.*[A-Z])(?=.*\d)/)
            .message(
                "Password must contain at least one uppercase letter and one digit",
            )
            .required(),
    })
}

export default ResetPasswordDTO