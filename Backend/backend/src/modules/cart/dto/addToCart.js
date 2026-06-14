// add to cart dto 

import BaseDTO from "../../../common/dto/base.dto";


class AddToCartDTO extends BaseDTO {
    static schema = Joi.object({
        productId: Joi.string().trim().required(),
    });
}

export default AddToCartDTO