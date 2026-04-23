// routes/contact.js
const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/contactController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { globalLimiter } = require('../middleware/rateLimiter');

// POST /api/contact  — formulaire public (rate-limité)
router.post('/', globalLimiter, [
  body('name').trim().isLength({ min: 2, max: 150 }).withMessage('Nom invalide (2-150 caractères).'),
  body('email').isEmail().withMessage('Adresse email invalide.'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message trop court (10 caractères minimum).'),
], validate, ctrl.sendMessage);

// Routes admin (authentifiées)
router.get('/messages',             authenticate, ctrl.getMessages);
router.patch('/messages/:id/read',  authenticate, ctrl.markAsRead);
router.delete('/messages/:id',      authenticate, ctrl.deleteMessage);

module.exports = router;
