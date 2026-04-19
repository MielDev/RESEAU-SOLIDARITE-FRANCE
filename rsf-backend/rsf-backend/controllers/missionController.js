// controllers/missionController.js
const { Mission, MissionItem } = require('../models');
const { createError } = require('../middleware/errorHandler');

const getAll = async (req, res, next) => {
  try {
    const missions = await Mission.findAll({
      include: [{ model: MissionItem, as: 'items', order: [['sort_order','ASC']] }],
      order: [['sort_order','ASC']],
    });
    res.json({ success: true, data: missions });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const m = await Mission.findByPk(req.params.id, {
      include: [{ model: MissionItem, as: 'items', order: [['sort_order','ASC']] }],
    });
    if (!m) throw createError('Mission introuvable.', 404);
    res.json({ success: true, data: m });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { items, ...mData } = req.body;
    const mission = await Mission.create(mData);
    if (items?.length) {
      await MissionItem.bulkCreate(items.map((text, i) => ({ mission_id: mission.id, text, sort_order: i })));
    }
    const full = await Mission.findByPk(mission.id, { include: [{ model: MissionItem, as: 'items' }] });
    res.status(201).json({ success: true, message: 'Mission créée.', data: full });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { items, ...mData } = req.body;
    const mission = await Mission.findByPk(req.params.id);
    if (!mission) throw createError('Mission introuvable.', 404);
    await mission.update(mData);
    if (items !== undefined) {
      await MissionItem.destroy({ where: { mission_id: mission.id } });
      if (items.length) {
        await MissionItem.bulkCreate(items.map((text, i) => ({ mission_id: mission.id, text, sort_order: i })));
      }
    }
    const full = await Mission.findByPk(mission.id, { include: [{ model: MissionItem, as: 'items' }] });
    res.json({ success: true, message: 'Mission mise à jour.', data: full });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const m = await Mission.findByPk(req.params.id);
    if (!m) throw createError('Mission introuvable.', 404);
    await m.destroy(); // CASCADE supprime les items
    res.json({ success: true, message: 'Mission supprimée.' });
  } catch (err) { next(err); }
};

const reorder = async (req, res, next) => {
  try {
    const { order } = req.body;
    await Promise.all(order.map(({ id, sort_order }) =>
      Mission.update({ sort_order }, { where: { id } })
    ));
    res.json({ success: true, message: 'Ordre mis à jour.' });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, create, update, remove, reorder };
