// routes/settings.js
const router = require('express').Router();
const ctrl = require('../controllers/settingsController');

router.get('/',  ctrl.getAll);
router.put('/',  ctrl.updateMany);

module.exports = router;
