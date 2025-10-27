import { Router } from 'express';
import { createList, deleteList, listLists, updateList } from '../controllers/listController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { createListValidation, listIdParamValidation, updateListValidation } from '../validators/listValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', listLists);
router.post('/', createListValidation, validateRequest, createList);
router.put('/:id', listIdParamValidation, updateListValidation, validateRequest, updateList);
router.delete('/:id', listIdParamValidation, validateRequest, deleteList);

export default router;
