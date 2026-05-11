const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/helpAuthController');
const { authenticateHelpUser } = require('../middleware/helpAuth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, [
  body('firstName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Prenom invalide.'),
  body('first_name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Prenom invalide.'),
  body('lastName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nom invalide.'),
  body('last_name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nom invalide.'),
  body('email').isEmail().withMessage('Adresse email invalide.'),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caracteres.'),
  body('phone').trim().isLength({ min: 4, max: 50 }).withMessage('Telephone invalide.'),
  body('birthDate').optional().isISO8601().withMessage('Date de naissance invalide.'),
  body('birth_date').optional().isISO8601().withMessage('Date de naissance invalide.'),
  body('nationality').trim().isLength({ min: 2, max: 150 }).withMessage('Nationalite invalide.'),
  body('status').trim().isLength({ min: 2, max: 100 }).withMessage('Statut invalide.'),
], validate, ctrl.register);

router.post('/login', authLimiter, [
  body('email').isEmail().withMessage('Adresse email invalide.'),
  body('password').notEmpty().withMessage('Mot de passe requis.'),
], validate, ctrl.login);

router.post('/password-reset/request', authLimiter, [
  body('email').isEmail().withMessage('Adresse email invalide.'),
], validate, ctrl.requestPasswordReset);

router.post('/password-reset/confirm', authLimiter, [
  body('email').isEmail().withMessage('Adresse email invalide.'),
  body('token').trim().isLength({ min: 4, max: 20 }).withMessage('Code invalide.'),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caracteres.'),
], validate, ctrl.resetPassword);

router.get('/me', authenticateHelpUser, ctrl.me);

module.exports = router;
