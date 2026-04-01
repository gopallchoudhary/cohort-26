import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto.js";


class ResetPasswordDTO extends BaseDTO {
    static schema = Joi.object({
        email: Joi.string().email()
    })
}

export default ResetPasswordDTO