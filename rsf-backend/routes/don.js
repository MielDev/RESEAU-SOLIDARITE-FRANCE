// routes/don.js
const router = require('express').Router();
const crudFactory = require('../controllers/crudFactory');
const { DonMode } = require('../models');

const ctrl = crudFactory(DonMode, 'mode de don', {
  orderBy: [['sort_order', 'ASC']],
  publicFilter: { is_published: true },
});

router.get('/',         ctrl.getAll);
router.get('/:id',      ctrl.getOne);
router.post('/',        ctrl.create);
router.put('/reorder',  ctrl.reorder);
router.put('/:id',      ctrl.update);
router.delete('/:id',   ctrl.remove);

module.exports = router;
