const jwt = require('jsonwebtoken');
const { HelpUser } = require('../models');

const authenticateHelpUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token utilisateur manquant ou invalide.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== 'help-user') {
      return res.status(401).json({ success: false, message: 'Token utilisateur invalide.' });
    }

    const user = await HelpUser.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Compte utilisateur introuvable ou desactive.' });
    }

    req.helpUser = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expiree. Reconnectez-vous.' });
    }

    return res.status(401).json({ success: false, message: 'Token utilisateur invalide.' });
  }
};

module.exports = { authenticateHelpUser };
