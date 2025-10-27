import jwt from 'jsonwebtoken';
import process from 'node:process';

const { JWT_SECRET = 'change-me', JWT_EXPIRES_IN = '1d' } = process.env;

export const signToken = (payload, options = {}) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN, ...options });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
