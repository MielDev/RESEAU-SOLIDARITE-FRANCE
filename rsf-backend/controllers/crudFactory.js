// controllers/crudFactory.js
// ─── Fabrique de contrôleurs CRUD génériques ──────────────────────────────────
const { createError } = require('../middleware/errorHandler');

/**
 * Génère les 5 opérations CRUD standard pour un modèle Sequelize.
 * @param {Model} Model   - Le modèle Sequelize
 * @param {string} label  - Nom lisible (ex: 'témoignage')
 * @param {object} opts   - { findOptions, orderBy, publicFilter }
 */
const crudFactory = (Model, label, opts = {}) => {
  const { findOptions = {}, orderBy = [['sort_order', 'ASC']], publicFilter = {} } = opts;

  return {
    getAll: async (req, res, next) => {
      try {
        const where = req.user ? {} : publicFilter;
        const rows = await Model.findAll({ where, order: orderBy, ...findOptions });
        res.json({ success: true, data: rows, total: rows.length });
      } catch (err) { next(err); }
    },

    getOne: async (req, res, next) => {
      try {
        const row = await Model.findByPk(req.params.id, findOptions);
        if (!row) throw createError(`${label} introuvable.`, 404);
        res.json({ success: true, data: row });
      } catch (err) { next(err); }
    },

    create: async (req, res, next) => {
      try {
        const row = await Model.create(req.body);
        res.status(201).json({ success: true, message: `${label} créé(e).`, data: row });
      } catch (err) { next(err); }
    },

    update: async (req, res, next) => {
      try {
        const row = await Model.findByPk(req.params.id);
        if (!row) throw createError(`${label} introuvable.`, 404);
        await row.update(req.body);
        res.json({ success: true, message: `${label} mis(e) à jour.`, data: row });
      } catch (err) { next(err); }
    },

    remove: async (req, res, next) => {
      try {
        const row = await Model.findByPk(req.params.id);
        if (!row) throw createError(`${label} introuvable.`, 404);
        await row.destroy();
        res.json({ success: true, message: `${label} supprimé(e).` });
      } catch (err) { next(err); }
    },

    reorder: async (req, res, next) => {
      try {
        const { order } = req.body; // [{ id, sort_order }]
        await Promise.all(order.map(({ id, sort_order }) =>
          Model.update({ sort_order }, { where: { id } })
        ));
        res.json({ success: true, message: 'Ordre mis à jour.' });
      } catch (err) { next(err); }
    },
  };
};

module.exports = crudFactory;
