import { Router } from 'express';
import { deleteUser, getUser, listUsers, updateUser } from '../controllers/userController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { updateUserValidation, userIdParamValidation } from '../validators/userValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', requireRole('admin'), listUsers);
router.get('/:id', userIdParamValidation, validateRequest, getUser);
router.put('/:id', userIdParamValidation, updateUserValidation, validateRequest, updateUser);
router.delete('/:id', requireRole('admin'), userIdParamValidation, validateRequest, deleteUser);

export default router;
