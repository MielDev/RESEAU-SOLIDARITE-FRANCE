// routes/testimonials.js
const router = require('express').Router();
const crudFactory = require('../controllers/crudFactory');
const { Testimonial } = require('../models');

const ctrl = crudFactory(Testimonial, 'témoignage', {
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
