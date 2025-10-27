import { body, param } from 'express-validator';

const statusValues = ['A contatar', 'Contatado', 'Negociação', 'Ganho', 'Perdido'];

export const leadIdParamValidation = [
  param('id').isUUID().withMessage('ID do lead inválido.'),
];

const baseLeadValidation = [
  body('name').optional().trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('phone').optional().trim().notEmpty().withMessage('Telefone é obrigatório.'),
  body('website').optional().isURL().withMessage('Website inválido.'),
  body('address').optional().isString(),
  body('gmb_rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Avaliação deve estar entre 0 e 5.'),
  body('gmb_review_count').optional().isInt({ min: 0 }),
  body('instagram_profile').optional().isString(),
  body('status').optional().isIn(statusValues).withMessage('Status inválido.'),
  body('city').optional().notEmpty().withMessage('Cidade é obrigatória.'),
  body('neighborhood').optional().isString(),
  body('tags').optional().isArray().withMessage('Tags deve ser um array.'),
  body('listIds').optional().isArray().withMessage('Listas deve ser um array.'),
  body('observations').optional().isArray().withMessage('Observações deve ser um array.'),
  body('sources').optional().isArray().withMessage('Fontes deve ser um array.'),
  body('user_id').optional().isUUID().withMessage('Usuário inválido.'),
];

export const createLeadValidation = [
  body('name').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('phone').trim().notEmpty().withMessage('Telefone é obrigatório.'),
  body('city').trim().notEmpty().withMessage('Cidade é obrigatória.'),
  body('status').optional().isIn(statusValues).withMessage('Status inválido.'),
  ...baseLeadValidation,
];

export const updateLeadValidation = baseLeadValidation;
