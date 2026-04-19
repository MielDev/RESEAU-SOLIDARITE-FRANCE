// routes/auth.js
const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/auth/login
router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Email invalide.'),
  body('password').notEmpty().withMessage('Mot de passe requis.'),
], validate, ctrl.login);

// GET /api/auth/me
router.get('/me', authenticate, ctrl.me);

// POST /api/auth/change-password
router.post('/change-password', authenticate, [
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 8 }).withMessage('8 caractères minimum.'),
], validate, ctrl.changePassword);

module.exports = router;
