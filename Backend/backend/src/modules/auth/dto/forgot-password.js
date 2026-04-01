import Joi from "joi";
import BaseDTO from "../../../common/dto/base.dto.js";

class ForgotPasswordDTO extends BaseDTO {
    static schema = Joi.object({
        email: Joi.string().email()
    })
}

export default ForgotPasswordDTO