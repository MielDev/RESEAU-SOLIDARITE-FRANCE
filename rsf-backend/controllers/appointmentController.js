const { AppointmentBooking, AppointmentSlot, HelpUser, sequelize } = require('../models');
const { createError } = require('../middleware/errorHandler');
const { Op } = require('sequelize');

const toSlotClient = (slot, booking = null) => ({
  id: slot.id,
  label: slot.label,
  date: slot.date,
  startTime: slot.start_time,
  endTime: slot.end_time,
  location: slot.location || '',
  notes: slot.notes || '',
  isActive: slot.is_active,
  isBooked: Boolean(booking),
  createdAt: slot.createdAt,
  booking: booking ? toBookingClient(booking, false) : null,
});

const toBookingClient = (booking, includeSlot = true) => ({
  id: booking.id,
  slotId: booking.appointment_slot_id,
  userId: booking.help_user_id,
  userName: booking.user_name,
  email: booking.email,
  phone: booking.phone,
  bookedAt: booking.booked_at,
  status: booking.status,
  slot: includeSlot && booking.slot ? toSlotClient(booking.slot) : null,
});

const listPublicSlots = async (req, res, next) => {
  try {
    const slots = await AppointmentSlot.findAll({
      where: { is_active: true },
      include: [{
        model: AppointmentBooking,
        as: 'booking',
        required: false,
        where: { status: 'confirmed' },
      }],
      order: [['date', 'ASC'], ['start_time', 'ASC']],
    });
    const availableSlots = slots.filter((slot) => !slot.booking);

    res.json({
      success: true,
      data: availableSlots.map((slot) => toSlotClient(slot, null)),
      total: availableSlots.length,
    });
  } catch (err) {
    next(err);
  }
};

const listAdminSlots = async (req, res, next) => {
  try {
    const slots = await AppointmentSlot.findAll({
      include: [{
        model: AppointmentBooking,
        as: 'booking',
        required: false,
        where: { status: 'confirmed' },
      }],
      order: [['date', 'ASC'], ['start_time', 'ASC']],
    });

    res.json({
      success: true,
      data: slots.map((slot) => toSlotClient(slot, slot.booking)),
      total: slots.length,
    });
  } catch (err) {
    next(err);
  }
};

const createSlot = async (req, res, next) => {
  try {
    const slot = await AppointmentSlot.create(toSlotPayload(req.body));
    res.status(201).json({ success: true, message: 'Creneau cree.', data: toSlotClient(slot) });
  } catch (err) {
    next(err);
  }
};

const updateSlot = async (req, res, next) => {
  try {
    const slot = await AppointmentSlot.findByPk(req.params.id);
    if (!slot) throw createError('Creneau introuvable.', 404);

    await slot.update(toSlotPayload(req.body));
    res.json({ success: true, message: 'Creneau mis a jour.', data: toSlotClient(slot) });
  } catch (err) {
    next(err);
  }
};

const deleteSlot = async (req, res, next) => {
  try {
    const slot = await AppointmentSlot.findByPk(req.params.id);
    if (!slot) throw createError('Creneau introuvable.', 404);

    const booking = await AppointmentBooking.findOne({ where: { appointment_slot_id: slot.id, status: 'confirmed' } });
    if (booking) {
      throw createError('Ce creneau a deja un rendez-vous. Liberez le rendez-vous avant de supprimer le creneau.', 409);
    }

    await slot.destroy();
    res.json({ success: true, message: 'Creneau supprime.' });
  } catch (err) {
    next(err);
  }
};

const bookSlot = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const slot = await AppointmentSlot.findByPk(req.body.slotId, { transaction });
    if (!slot || !slot.is_active) {
      throw createError('Creneau introuvable ou indisponible.', 404);
    }

    const existingForSlot = await AppointmentBooking.findOne({
      where: { appointment_slot_id: slot.id, status: 'confirmed' },
      transaction,
    });

    if (existingForSlot) {
      throw createError('Ce creneau est deja reserve.', 409);
    }

    const existingForUser = await AppointmentBooking.findOne({
      where: { help_user_id: req.helpUser.id, status: 'confirmed' },
      transaction,
    });

    if (existingForUser) {
      throw createError('Vous avez deja un rendez-vous confirme.', 409);
    }

    const booking = await AppointmentBooking.create({
      appointment_slot_id: slot.id,
      help_user_id: req.helpUser.id,
      user_name: `${req.helpUser.first_name} ${req.helpUser.last_name}`.trim(),
      email: req.helpUser.email,
      phone: req.helpUser.phone,
      booked_at: new Date(),
      status: 'confirmed',
    }, { transaction });

    await transaction.commit();

    const created = await AppointmentBooking.findByPk(booking.id, {
      include: [{ model: AppointmentSlot, as: 'slot' }],
    });

    res.status(201).json({ success: true, message: 'Rendez-vous confirme.', data: toBookingClient(created) });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

const rescheduleMyBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const booking = await AppointmentBooking.findOne({
      where: { help_user_id: req.helpUser.id, status: 'confirmed' },
      transaction,
    });

    if (!booking) {
      throw createError('Aucun rendez-vous confirme a modifier.', 404);
    }

    const slot = await AppointmentSlot.findByPk(req.body.slotId, { transaction });
    if (!slot || !slot.is_active) {
      throw createError('Creneau introuvable ou indisponible.', 404);
    }

    const existingForSlot = await AppointmentBooking.findOne({
      where: {
        appointment_slot_id: slot.id,
        status: 'confirmed',
        id: { [Op.ne]: booking.id },
      },
      transaction,
    });

    if (existingForSlot) {
      throw createError('Ce creneau est deja reserve.', 409);
    }

    await booking.update({
      appointment_slot_id: slot.id,
      booked_at: new Date(),
    }, { transaction });

    await transaction.commit();

    const updated = await AppointmentBooking.findByPk(booking.id, {
      include: [{ model: AppointmentSlot, as: 'slot' }],
    });

    res.json({ success: true, message: 'Rendez-vous modifie.', data: toBookingClient(updated) });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

const cancelMyBooking = async (req, res, next) => {
  try {
    const booking = await AppointmentBooking.findOne({
      where: { help_user_id: req.helpUser.id, status: 'confirmed' },
    });

    if (!booking) {
      throw createError('Aucun rendez-vous confirme a annuler.', 404);
    }

    await booking.destroy();
    res.json({ success: true, message: 'Rendez-vous annule. Le creneau est de nouveau disponible.' });
  } catch (err) {
    next(err);
  }
};

const getMyBooking = async (req, res, next) => {
  try {
    const booking = await AppointmentBooking.findOne({
      where: { help_user_id: req.helpUser.id, status: 'confirmed' },
      include: [{ model: AppointmentSlot, as: 'slot' }],
      order: [['booked_at', 'DESC']],
    });

    res.json({ success: true, data: booking ? toBookingClient(booking) : null });
  } catch (err) {
    next(err);
  }
};

const listBookings = async (req, res, next) => {
  try {
    const bookings = await AppointmentBooking.findAll({
      include: [
        { model: AppointmentSlot, as: 'slot' },
        { model: HelpUser, as: 'help_user', attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'status'] },
      ],
      order: [['booked_at', 'DESC']],
    });

    res.json({
      success: true,
      data: bookings.map((booking) => toBookingClient(booking)),
      total: bookings.length,
    });
  } catch (err) {
    next(err);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    const booking = await AppointmentBooking.findByPk(req.params.id);
    if (!booking) throw createError('Rendez-vous introuvable.', 404);

    await booking.destroy();
    res.json({ success: true, message: 'Rendez-vous supprime. Le creneau est de nouveau disponible.' });
  } catch (err) {
    next(err);
  }
};

const toSlotPayload = (body) => ({
  label: String(body.label || '').trim(),
  date: body.date,
  start_time: body.startTime || body.start_time,
  end_time: body.endTime || body.end_time,
  location: String(body.location || '').trim(),
  notes: String(body.notes || '').trim(),
  is_active: 'isActive' in body ? Boolean(body.isActive) : ('is_active' in body ? Boolean(body.is_active) : true),
});

module.exports = {
  bookSlot,
  cancelMyBooking,
  createSlot,
  deleteBooking,
  deleteSlot,
  getMyBooking,
  listAdminSlots,
  listBookings,
  listPublicSlots,
  rescheduleMyBooking,
  updateSlot,
};
