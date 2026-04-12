import { Router } from 'express';
import * as controller from '../controllers/owner.controller.js'
const router = Router();

// create a new owner
router.post('/', controller.createOwner)

// get all owners
router.get('/', controller.getAllOwners)

// get a single owner by id
router.get('/:id', controller.getOwnerById)

// update an owner by id
router.put('/:id', controller.updateOwnerById)

// delete an owner by id
router.delete('/:id', controller.deleteOwnerById)

export default router;