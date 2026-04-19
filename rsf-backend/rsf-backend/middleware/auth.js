// middleware/auth.js
// ─── Vérification JWT + rôles ─────────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Vérifie que la requête contient un JWT valide.
 * Attache req.user au contexte.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token manquant ou invalide.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Utilisateur introuvable ou désactivé.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expirée. Reconnectez-vous.' });
    }
    return res.status(401).json({ success: false, message: 'Token invalide.' });
  }
};

/**
 * Vérifie que l'utilisateur a le rôle requis.
 * Utilise après `authenticate`.
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Accès refusé. Rôle requis : ${roles.join(' ou ')}.`,
    });
  }
  next();
};

module.exports = { authenticate, authorize };
