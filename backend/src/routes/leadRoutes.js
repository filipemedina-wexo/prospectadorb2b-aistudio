import { Router } from 'express';
import { createLead, deleteLead, getLead, listLeads, updateLead } from '../controllers/leadController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import {
  createLeadValidation,
  leadIdParamValidation,
  updateLeadValidation,
} from '../validators/leadValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', listLeads);
router.get('/:id', leadIdParamValidation, validateRequest, getLead);
router.post('/', createLeadValidation, validateRequest, createLead);
router.put('/:id', leadIdParamValidation, updateLeadValidation, validateRequest, updateLead);
router.delete('/:id', leadIdParamValidation, validateRequest, deleteLead);

export default router;
