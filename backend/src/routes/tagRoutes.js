import { Router } from 'express';
import { createTag, deleteTag, listTags, updateTag } from '../controllers/tagController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { createTagValidation, tagIdParamValidation, updateTagValidation } from '../validators/tagValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', listTags);
router.post('/', createTagValidation, validateRequest, createTag);
router.put('/:id', tagIdParamValidation, updateTagValidation, validateRequest, updateTag);
router.delete('/:id', tagIdParamValidation, validateRequest, deleteTag);

export default router;
