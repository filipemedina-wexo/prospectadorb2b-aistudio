import { body } from 'express-validator';

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('email').isEmail().withMessage('E-mail inválido.'),
  body('password')
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

export const loginValidation = [
  body('email').isEmail().withMessage('E-mail inválido.'),
  body('password').notEmpty().withMessage('Senha é obrigatória.'),
];
