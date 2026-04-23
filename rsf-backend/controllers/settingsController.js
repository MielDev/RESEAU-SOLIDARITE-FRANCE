// controllers/settingsController.js
const { Setting } = require('../models');

// GET /api/settings  — ou  /api/settings?group=contact
const getAll = async (req, res, next) => {
  try {
    const where = req.query.group ? { group: req.query.group } : {};
    const rows = await Setting.findAll({ where, order: [['group','ASC'],['key','ASC']] });
    // Transformer en objet { key: value }
    const data = {};
    rows.forEach(r => { data[r.key] = r.value; });
    res.json({ success: true, data, raw: rows });
  } catch (err) { next(err); }
};

// PUT /api/settings  — body: { key: value, key2: value2 }
const updateMany = async (req, res, next) => {
  try {
    const ops = Object.entries(req.body).map(([key, value]) =>
      Setting.upsert({ key, value })
    );
    await Promise.all(ops);
    res.json({ success: true, message: 'Paramètres enregistrés.' });
  } catch (err) { next(err); }
};

module.exports = { getAll, updateMany };
