import models from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';

const ensureOwnership = (resourceUserId, requester) => {
  if (requester.role === 'admin') return true;
  return resourceUserId === requester.id;
};

const serializeLead = (lead) => ({
  id: lead.id,
  user_id: lead.user_id,
  name: lead.name,
  phone: lead.phone,
  website: lead.website,
  address: lead.address,
  gmb_rating: lead.gmb_rating,
  gmb_review_count: lead.gmb_review_count,
  instagram_profile: lead.instagram_profile,
  status: lead.status,
  city: lead.city,
  neighborhood: lead.neighborhood,
  tags: lead.tags ?? [],
  listIds: lead.listIds ?? [],
  observations: lead.observations ?? [],
  sources: lead.sources ?? [],
  created_at: lead.createdAt,
  updated_at: lead.updatedAt,
});

const normalizePayload = (payload) => ({
  ...payload,
  tags: payload.tags ?? [],
  listIds: payload.listIds ?? [],
  observations: payload.observations ?? [],
  sources: payload.sources ?? [],
});

export const listLeads = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const filter = {};

  if (req.user.role === 'admin' && userId) {
    filter.user_id = userId;
  } else {
    filter.user_id = req.user.id;
  }

  const leads = await models.Lead.findAll({ where: filter, order: [['createdAt', 'DESC']] });
  res.json({ leads: leads.map(serializeLead) });
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await models.Lead.findByPk(req.params.id);
  if (!lead) {
    return res.status(404).json({ message: 'Lead não encontrado.' });
  }

  if (!ensureOwnership(lead.user_id, req.user)) {
    return res.status(403).json({ message: 'Você não tem acesso a este lead.' });
  }

  return res.json({ lead: serializeLead(lead) });
});

export const createLead = asyncHandler(async (req, res) => {
  const payload = normalizePayload(req.body);
  const userId = req.user.role === 'admin' && payload.user_id ? payload.user_id : req.user.id;

  const lead = await models.Lead.create({ ...payload, user_id: userId });
  res.status(201).json({ lead: serializeLead(lead) });
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await models.Lead.findByPk(req.params.id);
  if (!lead) {
    return res.status(404).json({ message: 'Lead não encontrado.' });
  }

  if (!ensureOwnership(lead.user_id, req.user)) {
    return res.status(403).json({ message: 'Você não tem acesso a este lead.' });
  }

  const payload = normalizePayload(req.body);
  if (req.user.role === 'admin' && payload.user_id) {
    lead.user_id = payload.user_id;
  }

  Object.assign(lead, payload);
  await lead.save();

  res.json({ lead: serializeLead(lead) });
});

export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await models.Lead.findByPk(req.params.id);
  if (!lead) {
    return res.status(404).json({ message: 'Lead não encontrado.' });
  }

  if (!ensureOwnership(lead.user_id, req.user)) {
    return res.status(403).json({ message: 'Você não tem acesso a este lead.' });
  }

  await lead.destroy();
  res.status(204).send();
});
