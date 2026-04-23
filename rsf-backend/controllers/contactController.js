// controllers/contactController.js
// ─── Gestion des messages reçus via le formulaire de contact ─────────────────
const { ContactMessage } = require('../models');

// POST /api/contact  (route publique — sans auth)
const sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const msg = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({
      success: true,
      message: 'Votre message a bien été envoyé. Nous vous répondrons sous 48h.',
      data: { id: msg.id },
    });
  } catch (err) { next(err); }
};

// GET /api/contact/messages  (admin)
const getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: messages, total: messages.length });
  } catch (err) { next(err); }
};

// PATCH /api/contact/messages/:id/read  (admin — marquer comme lu)
const markAsRead = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message introuvable.' });
    await msg.update({ is_read: true });
    res.json({ success: true, message: 'Message marqué comme lu.' });
  } catch (err) { next(err); }
};

// DELETE /api/contact/messages/:id  (admin)
const deleteMessage = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: 'Message introuvable.' });
    await msg.destroy();
    res.json({ success: true, message: 'Message supprimé.' });
  } catch (err) { next(err); }
};

module.exports = { sendMessage, getMessages, markAsRead, deleteMessage };
