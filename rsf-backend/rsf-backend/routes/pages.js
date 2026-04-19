// routes/pages.js
const router = require('express').Router();
const ctrl = require('../controllers/pageController');

router.get('/',         ctrl.listPages);
router.get('/:pageKey', ctrl.getPage);
router.put('/:pageKey', ctrl.updatePage);

module.exports = router;
