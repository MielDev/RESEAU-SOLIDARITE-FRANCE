const jwt = require('jsonwebtoken');
const { HelpPasswordReset, HelpUser } = require('../models');
const { createError } = require('../middleware/errorHandler');

const allowedStatuses = [
  'Etudiant',
  "Demandeur d'emploi",
  'Travailleur salarie',
  'Travailleur independant',
  'Sans activite',
  'Autre',
];

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const toClientUser = (user) => {
  const safe = user.toSafeJSON ? user.toSafeJSON() : user.toJSON();
  return {
    id: safe.id,
    firstName: safe.first_name,
    lastName: safe.last_name,
    email: safe.email,
    phone: safe.phone,
    birthDate: safe.birth_date,
    nationality: safe.nationality,
    status: safe.status,
  };
};

const createToken = (user) => jwt.sign(
  { id: user.id, type: 'help-user' },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);

const register = async (req, res, next) => {
  try {
    const {
      firstName,
      first_name,
      lastName,
      last_name,
      email,
      password,
      phone,
      birthDate,
      birth_date,
      nationality,
      status,
    } = req.body;

    const normalizedEmail = normalizeEmail(email);
    const normalizedStatus = String(status || '').trim();

    if (!allowedStatuses.includes(normalizedStatus)) {
      throw createError('Statut invalide.', 400);
    }

    const existing = await HelpUser.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      throw createError('Un compte existe deja avec cette adresse e-mail.', 409);
    }

    const user = await HelpUser.create({
      first_name: first_name || firstName,
      last_name: last_name || lastName,
      email: normalizedEmail,
      password,
      phone,
      birth_date: birth_date || birthDate,
      nationality,
      status: normalizedStatus,
    });

    res.status(201).json({
      success: true,
      message: 'Compte cree avec succes.',
      data: {
        token: createToken(user),
        user: toClientUser(user),
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await HelpUser.findOne({ where: { email: normalizeEmail(email) } });

    if (!user || !user.is_active || !await user.checkPassword(password)) {
      throw createError('Adresse e-mail ou mot de passe incorrect.', 401);
    }

    await user.update({ last_login: new Date() });

    res.json({
      success: true,
      message: 'Connexion reussie.',
      data: {
        token: createToken(user),
        user: toClientUser(user),
      },
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res) => {
  res.json({ success: true, data: toClientUser(req.helpUser) });
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const user = await HelpUser.findOne({ where: { email } });

    if (!user || !user.is_active) {
      throw createError('Aucun compte utilisateur ne correspond a cette adresse.', 404);
    }

    await HelpPasswordReset.update(
      { used_at: new Date() },
      { where: { email, used_at: null } }
    );

    const token = String(Math.floor(100000 + Math.random() * 900000));
    const reset = await HelpPasswordReset.create({
      help_user_id: user.id,
      email,
      token,
      expires_at: new Date(Date.now() + 1000 * 60 * 20),
    });

    res.json({
      success: true,
      message: 'Code de reinitialisation cree.',
      data: {
        token: reset.token,
        expiresAt: reset.expires_at,
      },
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const token = String(req.body.token || '').trim();
    const password = req.body.password;

    const reset = await HelpPasswordReset.findOne({
      where: { email, token, used_at: null },
      order: [['createdAt', 'DESC']],
    });

    if (!reset) {
      throw createError('Code de verification invalide.', 400);
    }

    if (new Date(reset.expires_at).getTime() < Date.now()) {
      await reset.update({ used_at: new Date() });
      throw createError('Ce code a expire. Demandez un nouveau code.', 400);
    }

    const user = await HelpUser.findByPk(reset.help_user_id);
    if (!user || !user.is_active) {
      throw createError('Compte introuvable.', 404);
    }

    await user.update({ password });
    await reset.update({ used_at: new Date() });

    res.json({ success: true, message: 'Mot de passe mis a jour.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  allowedStatuses,
  login,
  me,
  register,
  requestPasswordReset,
  resetPassword,
  toClientUser,
};
