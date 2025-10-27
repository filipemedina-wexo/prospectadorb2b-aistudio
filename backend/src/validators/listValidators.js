import { body, param } from 'express-validator';

export const listIdParamValidation = [
  param('id').isUUID().withMessage('ID da lista inválido.'),
];

export const createListValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('description').optional().isString(),
  body('user_id').optional().isUUID().withMessage('Usuário inválido.'),
];

export const updateListValidation = [
  body('name').optional().trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('description').optional().isString(),
  body('user_id').optional().isUUID().withMessage('Usuário inválido.'),
];
