import models from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';

const serializeList = (list) => ({
  id: list.id,
  user_id: list.user_id,
  name: list.name,
  description: list.description,
  created_at: list.createdAt,
  updated_at: list.updatedAt,
});

const ensureOwnership = (resourceUserId, requester) => {
  if (requester.role === 'admin') return true;
  return resourceUserId === requester.id;
};

export const listLists = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const filter = {};

  if (req.user.role === 'admin' && userId) {
    filter.user_id = userId;
  } else {
    filter.user_id = req.user.id;
  }

  const lists = await models.List.findAll({ where: filter, order: [['name', 'ASC']] });
  res.json({ lists: lists.map(serializeList) });
});

export const createList = asyncHandler(async (req, res) => {
  const { name, description, user_id } = req.body;
  const ownerId = req.user.role === 'admin' && user_id ? user_id : req.user.id;

  const list = await models.List.create({ name, description, user_id: ownerId });
  res.status(201).json({ list: serializeList(list) });
});

export const updateList = asyncHandler(async (req, res) => {
  const list = await models.List.findByPk(req.params.id);
  if (!list) {
    return res.status(404).json({ message: 'Lista não encontrada.' });
  }

  if (!ensureOwnership(list.user_id, req.user)) {
    return res.status(403).json({ message: 'Você não tem acesso a esta lista.' });
  }

  const { name, description, user_id } = req.body;
  if (name) list.name = name;
  if (description !== undefined) list.description = description;
  if (req.user.role === 'admin' && user_id) {
    list.user_id = user_id;
  }

  await list.save();
  res.json({ list: serializeList(list) });
});

export const deleteList = asyncHandler(async (req, res) => {
  const list = await models.List.findByPk(req.params.id);
  if (!list) {
    return res.status(404).json({ message: 'Lista não encontrada.' });
  }

  if (!ensureOwnership(list.user_id, req.user)) {
    return res.status(403).json({ message: 'Você não tem acesso a esta lista.' });
  }

  await list.destroy();
  res.status(204).send();
});
