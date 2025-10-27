import { body, param } from 'express-validator';

export const userIdParamValidation = [
  param('id').isUUID().withMessage('ID do usuário inválido.'),
];

export const updateUserValidation = [
  body('name').optional().trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('email').optional().isEmail().withMessage('E-mail inválido.'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Senha deve conter pelo menos 8 caracteres.')
    .matches(/[A-Z]/)
    .withMessage('Senha deve conter ao menos uma letra maiúscula.')
    .matches(/[a-z]/)
    .withMessage('Senha deve conter ao menos uma letra minúscula.')
    .matches(/\d/)
    .withMessage('Senha deve conter ao menos um dígito.'),
  body('role').optional().isIn(['admin', 'user']).withMessage('Role inválido.'),
];
