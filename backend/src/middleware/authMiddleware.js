import crypto from 'node:crypto';
import models from '../models/index.js';
import { verifyToken } from '../utils/token.js';

const AUTH_HEADER = 'authorization';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers[AUTH_HEADER];
    if (!header || !header.toLowerCase().startsWith('bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    const token = header.slice(7);
    const decoded = verifyToken(token);

    const user = await models.User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    req.user = user;
    req.tokenPayload = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

export const requireRole = (roles) => (req, res, next) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Acesso negado.' });
  }
  return next();
};

export const attachRequestContext = (req, _res, next) => {
  req.context = {
    requestId: req.headers['x-request-id'] ?? crypto.randomUUID?.(),
    timestamp: new Date().toISOString(),
  };
  next();
};
