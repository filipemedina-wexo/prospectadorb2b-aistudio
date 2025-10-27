import models from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';

const serializeTag = (tag) => ({
  id: tag.id,
  user_id: tag.user_id,
  name: tag.name,
  color: tag.color,
  created_at: tag.createdAt,
  updated_at: tag.updatedAt,
});

const ensureOwnership = (resourceUserId, requester) => {
  if (requester.role === 'admin') return true;
  return resourceUserId === requester.id;
};

export const listTags = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const filter = {};

  if (req.user.role === 'admin' && userId) {
    filter.user_id = userId;
  } else {
    filter.user_id = req.user.id;
  }

  const tags = await models.Tag.findAll({ where: filter, order: [['name', 'ASC']] });
  res.json({ tags: tags.map(serializeTag) });
});

export const createTag = asyncHandler(async (req, res) => {
  const { name, color, user_id } = req.body;
  const ownerId = req.user.role === 'admin' && user_id ? user_id : req.user.id;

  const tag = await models.Tag.create({ name, color, user_id: ownerId });
  res.status(201).json({ tag: serializeTag(tag) });
});

export const updateTag = asyncHandler(async (req, res) => {
  const tag = await models.Tag.findByPk(req.params.id);
  if (!tag) {
    return res.status(404).json({ message: 'Tag não encontrada.' });
  }

  if (!ensureOwnership(tag.user_id, req.user)) {
    return res.status(403).json({ message: 'Você não tem acesso a esta tag.' });
  }

  const { name, color, user_id } = req.body;
  if (name) tag.name = name;
  if (color) tag.color = color;
  if (req.user.role === 'admin' && user_id) {
    tag.user_id = user_id;
  }

  await tag.save();
  res.json({ tag: serializeTag(tag) });
});

export const deleteTag = asyncHandler(async (req, res) => {
  const tag = await models.Tag.findByPk(req.params.id);
  if (!tag) {
    return res.status(404).json({ message: 'Tag não encontrada.' });
  }

  if (!ensureOwnership(tag.user_id, req.user)) {
    return res.status(403).json({ message: 'Você não tem acesso a esta tag.' });
  }

  await tag.destroy();
  res.status(204).send();
});
