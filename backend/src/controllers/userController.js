import bcrypt from 'bcryptjs';
import models from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';

const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  created_at: user.createdAt,
  updated_at: user.updatedAt,
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await models.User.findAll({ order: [['createdAt', 'DESC']] });
  res.json({ users: users.map(serializeUser) });
});

export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await models.User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  if (req.user.role !== 'admin' && req.user.id !== user.id) {
    return res.status(403).json({ message: 'Você não tem acesso a este usuário.' });
  }

  res.json({ user: serializeUser(user) });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await models.User.scope('withPassword').findByPk(id);
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  if (req.user.role !== 'admin' && req.user.id !== user.id) {
    return res.status(403).json({ message: 'Você não tem acesso a este usuário.' });
  }

  const { name, email, password, role } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  if (role && req.user.role === 'admin') {
    user.role = role;
  }

  await user.save();
  res.json({ user: serializeUser(user) });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.id === id) {
    return res.status(400).json({ message: 'Você não pode excluir o próprio usuário autenticado.' });
  }

  const user = await models.User.findByPk(id);
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  await user.destroy();
  res.status(204).send();
});
