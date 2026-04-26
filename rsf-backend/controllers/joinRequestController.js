// controllers/joinRequestController.js
const { JoinRequest } = require('../models');

const normalizeInterests = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

// POST /api/join-requests  (public)
const createJoinRequest = async (req, res, next) => {
  try {
    const {
      firstName,
      first_name,
      lastName,
      last_name,
      email,
      phone,
      city,
      status,
      intent,
      interests,
      message,
    } = req.body;
    const normalizedFirstName = first_name || firstName;
    const normalizedLastName = last_name || lastName;

    if (!normalizedFirstName || !normalizedLastName) {
      return res.status(400).json({ success: false, message: 'Nom et prenom obligatoires.' });
    }

    const request = await JoinRequest.create({
      first_name: normalizedFirstName,
      last_name: normalizedLastName,
      email,
      phone,
      city,
      status,
      intent,
      interests: normalizeInterests(interests),
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Votre demande a bien ete envoyee. Notre equipe vous recontactera rapidement.',
      data: { id: request.id },
    });
  } catch (err) { next(err); }
};

// GET /api/join-requests  (admin)
const getJoinRequests = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.processing_status) {
      where.processing_status = req.query.processing_status;
    }

    const requests = await JoinRequest.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: requests, total: requests.length });
  } catch (err) { next(err); }
};

// PATCH /api/join-requests/:id/read  (admin)
const markAsRead = async (req, res, next) => {
  try {
    const request = await JoinRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Demande introuvable.' });

    await request.update({ is_read: true });
    res.json({ success: true, message: 'Demande marquee comme lue.', data: request });
  } catch (err) { next(err); }
};

// PUT /api/join-requests/:id  (admin)
const updateJoinRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Demande introuvable.' });

    const payload = {};
    const editableFields = [
      'processing_status',
      'admin_notes',
      'is_read',
      'first_name',
      'last_name',
      'email',
      'phone',
      'city',
      'status',
      'intent',
      'message',
    ];

    editableFields.forEach((field) => {
      if (field in req.body) payload[field] = req.body[field];
    });

    if ('interests' in req.body) {
      payload.interests = normalizeInterests(req.body.interests);
    }

    if (
      payload.processing_status &&
      payload.processing_status !== request.processing_status &&
      ['accepted', 'refused', 'done'].includes(payload.processing_status)
    ) {
      payload.processed_at = new Date();
    }

    await request.update(payload);
    res.json({ success: true, message: 'Demande mise a jour.', data: request });
  } catch (err) { next(err); }
};

// DELETE /api/join-requests/:id  (admin)
const deleteJoinRequest = async (req, res, next) => {
  try {
    const request = await JoinRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Demande introuvable.' });

    await request.destroy();
    res.json({ success: true, message: 'Demande supprimee.' });
  } catch (err) { next(err); }
};

module.exports = {
  createJoinRequest,
  getJoinRequests,
  markAsRead,
  updateJoinRequest,
  deleteJoinRequest,
};
