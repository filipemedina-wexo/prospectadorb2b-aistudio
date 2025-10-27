import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.createdAt,
  updated_at: user.updatedAt,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await models.User.scope('withPassword').findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: 'E-mail já cadastrado.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await models.User.create({ name, email, password: hashedPassword, role });

  const token = signToken({ id: user.id, role: user.role });
  return res.status(201).json({ user: sanitizeUser(user), token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await models.User.scope('withPassword').findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const token = signToken({ id: user.id, role: user.role });
  return res.json({ user: sanitizeUser(user), token });
});

export const me = asyncHandler(async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});
