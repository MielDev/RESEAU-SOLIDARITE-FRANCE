// routes/index.js
// ─── Routeur principal — monte tous les sous-routeurs ─────────────────────────
const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// ── Routes publiques ──────────────────────────────────────────────────────────
router.use('/auth',         require('./auth'));
router.use('/public',       require('./public'));    // API publique (site front)
router.use('/actions-solidaires', require('./actions-solidaires')); // New route for actions solidaires

router.use('/contact',      require('./contact'));   // public POST + admin GET

// ── Routes protégées (JWT requis) ─────────────────────────────────────────────
router.use(authenticate);

router.use('/pages',        require('./pages'));
router.use('/team',         require('./team'));
router.use('/missions',     require('./missions'));
router.use('/actions',      require('./actions'));
router.use('/testimonials', require('./testimonials'));
router.use('/events',       require('./events'));
router.use('/actualities',  require('./actualities'));
router.use('/don',          require('./don'));
router.use('/settings',     require('./settings'));
router.use('/nav',          require('./nav'));

module.exports = router;
