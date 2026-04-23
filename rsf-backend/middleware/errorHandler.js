// middleware/errorHandler.js
// ─── Gestionnaire d'erreurs global ───────────────────────────────────────────

const errorHandler = (err, req, res, next) => {
  console.error('\x1b[31m[ERREUR]\x1b[0m', err.stack || err.message);

  // Erreurs Sequelize de validation
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(422).json({
      success: false,
      message: 'Erreur de validation base de données.',
      errors: err.errors?.map(e => ({ field: e.path, message: e.message })) || [],
    });
  }

  // Erreur personnalisée avec statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Erreur générique
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Une erreur interne est survenue.'
      : err.message,
  });
};

// Fabrique d'erreur avec code HTTP
const createError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { errorHandler, createError };
