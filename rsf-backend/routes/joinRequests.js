// routes/joinRequests.js
const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/joinRequestController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { globalLimiter } = require('../middleware/rateLimiter');

router.post('/', globalLimiter, [
  body('firstName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Prenom invalide.'),
  body('first_name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Prenom invalide.'),
  body('lastName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nom invalide.'),
  body('last_name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nom invalide.'),
  body('email').isEmail().withMessage('Adresse email invalide.'),
  body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 50 }).withMessage('Telephone invalide.'),
  body('city').optional({ values: 'falsy' }).trim().isLength({ max: 150 }).withMessage('Ville invalide.'),
  body('status').optional({ values: 'falsy' }).trim().isLength({ max: 100 }).withMessage('Statut invalide.'),
  body('intent').trim().isLength({ min: 2, max: 150 }).withMessage('Intention invalide.'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message trop court (10 caracteres minimum).'),
], validate, ctrl.createJoinRequest);

router.get('/', authenticate, ctrl.getJoinRequests);
router.patch('/:id/read', authenticate, ctrl.markAsRead);
router.put('/:id', authenticate, ctrl.updateJoinRequest);
router.delete('/:id', authenticate, ctrl.deleteJoinRequest);

module.exports = router;
