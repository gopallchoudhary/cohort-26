import * as ownerService from '../services/owner.service.js'
import ApiResponse from '../../../common/utils/api-response.js';


const createOwner = async (req, res) => {
    const owner = await ownerService.createOwner(req.body)
    return ApiResponse.created(res, "Owner created successfully", owner)
};


const getAllOwners = async (req, res) => {
    const owners = await ownerService.getAllOwners()
    return ApiResponse.ok(res, "Owners retrieved successfully", owners)
};

const getOwnerById = async (req, res) => {
    const owner = await ownerService.getOwnerById(req.params.id)
    return ApiResponse.ok(res, "Owner retrieved successfully", owner)
};

const updateOwnerById = async (req, res) => {
    const owner = await ownerService.updateOwnerById(req.params.id, req.body)
    return ApiResponse.ok(res, "Owner updated successfully", owner)
};

const deleteOwnerById = async (req, res) => {
    await ownerService.deleteOwnerById(req.params.id)
    return ApiResponse.ok(res, "Owner deleted successfully")
};

export {
    createOwner,
    getAllOwners,
    getOwnerById,
    updateOwnerById,
    deleteOwnerById,
}

