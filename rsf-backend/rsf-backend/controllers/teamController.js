// controllers/teamController.js
const { TeamMember } = require('../models');
const { createError } = require('../middleware/errorHandler');

const getAll = async (req, res, next) => {
  try {
    const members = await TeamMember.findAll({ order: [['is_president','DESC'],['sort_order','ASC']] });
    res.json({ success: true, data: members });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const m = await TeamMember.findByPk(req.params.id);
    if (!m) throw createError('Membre introuvable.', 404);
    res.json({ success: true, data: m });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const m = await TeamMember.create(req.body);
    res.status(201).json({ success: true, message: 'Membre ajouté.', data: m });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const m = await TeamMember.findByPk(req.params.id);
    if (!m) throw createError('Membre introuvable.', 404);
    await m.update(req.body);
    res.json({ success: true, message: 'Membre mis à jour.', data: m });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const m = await TeamMember.findByPk(req.params.id);
    if (!m) throw createError('Membre introuvable.', 404);
    await m.destroy();
    res.json({ success: true, message: 'Membre supprimé.' });
  } catch (err) { next(err); }
};

const reorder = async (req, res, next) => {
  try {
    // body: { order: [{ id: 1, sort_order: 0 }, ...] }
    const { order } = req.body;
    await Promise.all(order.map(({ id, sort_order }) =>
      TeamMember.update({ sort_order }, { where: { id } })
    ));
    res.json({ success: true, message: 'Ordre mis à jour.' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove, reorder };
