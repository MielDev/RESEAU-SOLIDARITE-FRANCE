// controllers/authController.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { createError } = require('../middleware/errorHandler');

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user || !user.is_active) {
      throw createError('Identifiants incorrects.', 401);
    }

    const valid = await user.checkPassword(password);
    if (!valid) throw createError('Identifiants incorrects.', 401);

    // Mise à jour last_login
    await user.update({ last_login: new Date() });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie.',
      data: { token, user: user.toSafeJSON() },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
const me = async (req, res) => {
  res.json({ success: true, data: req.user.toSafeJSON() });
};

// ── POST /api/auth/change-password ───────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);

    const valid = await user.checkPassword(current_password);
    if (!valid) throw createError('Mot de passe actuel incorrect.', 400);

    await user.update({ password: new_password });
    res.json({ success: true, message: 'Mot de passe mis à jour.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, me, changePassword };
