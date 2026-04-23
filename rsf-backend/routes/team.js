// routes/team.js
const router = require('express').Router();
const ctrl = require('../controllers/teamController');

router.get('/',          ctrl.getAll);
router.get('/:id',       ctrl.getOne);
router.post('/',         ctrl.create);
router.put('/reorder',   ctrl.reorder);
router.put('/:id',       ctrl.update);
router.delete('/:id',    ctrl.remove);

module.exports = router;
