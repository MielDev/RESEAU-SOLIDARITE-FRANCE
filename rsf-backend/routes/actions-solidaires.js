const router = require('express').Router();
const { Action } = require('../models');

router.get('/', async (req, res) => {
  try {
    const actions = await Action.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] });
    res.json(actions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
