import { body, param } from 'express-validator';

export const tagIdParamValidation = [
  param('id').isUUID().withMessage('ID da tag inválido.'),
];

export const createTagValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('color').trim().notEmpty().withMessage('Cor é obrigatória.'),
  body('user_id').optional().isUUID().withMessage('Usuário inválido.'),
];

export const updateTagValidation = [
  body('name').optional().trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('color').optional().trim().notEmpty().withMessage('Cor é obrigatória.'),
  body('user_id').optional().isUUID().withMessage('Usuário inválido.'),
];
