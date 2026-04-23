// middleware/validate.js
// ─── Validation des entrées (express-validator) ───────────────────────────────
const { validationResult } = require('express-validator');

/**
 * Middleware qui vérifie les erreurs de validation.
 * Renvoie 422 avec le détail des erreurs si présentes.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Données invalides.',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;
