const { Op, fn, col } = require('sequelize');
const {
  AppointmentBooking,
  AppointmentSlot,
  ContactMessage,
  HelpUser,
  JoinRequest,
  sequelize,
} = require('../models');

const RESOLVED_JOIN_STATUSES = ['accepted', 'refused', 'done'];
const OPEN_JOIN_STATUSES = ['new', 'in_progress', 'contacted'];

const toNumber = (value) => Number(value || 0);

const countGrouped = async (model, field, limit = 8) => {
  const rows = await model.findAll({
    attributes: [
      field,
      [fn('COUNT', col(field)), 'total'],
    ],
    where: {
      [field]: {
        [Op.ne]: null,
      },
    },
    group: [field],
    order: [[sequelize.literal('total'), 'DESC']],
    limit,
    raw: true,
  });

  const grandTotal = rows.reduce((sum, row) => sum + toNumber(row.total), 0);

  return rows
    .map((row) => ({
      label: String(row[field] || 'Non renseigne'),
      total: toNumber(row.total),
      percentage: grandTotal > 0 ? Math.round((toNumber(row.total) / grandTotal) * 100) : 0,
    }))
    .filter((row) => row.label.trim());
};

const recentDate = (row) => row.createdAt || row.booked_at || row.bookedAt || null;

const getStats = async (req, res, next) => {
  try {
    const since30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalRegistrations,
      recentRegistrations,
      activeRegistrations,
      joinRequestsTotal,
      joinRequestsResolved,
      joinRequestsOpen,
      joinRequestsUnread,
      contactMessagesTotal,
      contactMessagesRead,
      contactMessagesUnread,
      appointmentsConfirmed,
      appointmentSlotsTotal,
      appointmentSlotsActive,
      countries,
      userStatuses,
      recentUsers,
      recentJoinRequests,
      recentContactMessages,
      recentAppointments,
      activeSlots,
    ] = await Promise.all([
      HelpUser.count(),
      HelpUser.count({ where: { createdAt: { [Op.gte]: since30Days } } }),
      HelpUser.count({ where: { is_active: true } }),
      JoinRequest.count(),
      JoinRequest.count({ where: { processing_status: { [Op.in]: RESOLVED_JOIN_STATUSES } } }),
      JoinRequest.count({ where: { processing_status: { [Op.in]: OPEN_JOIN_STATUSES } } }),
      JoinRequest.count({ where: { is_read: false } }),
      ContactMessage.count(),
      ContactMessage.count({ where: { is_read: true } }),
      ContactMessage.count({ where: { is_read: false } }),
      AppointmentBooking.count({ where: { status: 'confirmed' } }),
      AppointmentSlot.count(),
      AppointmentSlot.count({ where: { is_active: true } }),
      countGrouped(HelpUser, 'nationality', 10),
      countGrouped(HelpUser, 'status', 6),
      HelpUser.findAll({
        attributes: ['id', 'first_name', 'last_name', 'nationality', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5,
      }),
      JoinRequest.findAll({
        attributes: ['id', 'first_name', 'last_name', 'processing_status', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5,
      }),
      ContactMessage.findAll({
        attributes: ['id', 'name', 'subject', 'is_read', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5,
      }),
      AppointmentBooking.findAll({
        include: [{ model: AppointmentSlot, as: 'slot' }],
        order: [['booked_at', 'DESC']],
        limit: 5,
      }),
      AppointmentSlot.findAll({
        where: { is_active: true },
        include: [{
          model: AppointmentBooking,
          as: 'booking',
          required: false,
          where: { status: 'confirmed' },
        }],
      }),
    ]);

    const availableSlots = activeSlots.filter((slot) => !slot.booking).length;
    const requestsTotal = joinRequestsTotal + contactMessagesTotal;
    const requestsResolved = joinRequestsResolved + contactMessagesRead;
    const recentActivity = [
      ...recentUsers.map((user) => ({
        type: 'registration',
        label: `${user.first_name} ${user.last_name}`.trim(),
        meta: user.nationality || 'Inscription',
        date: recentDate(user),
      })),
      ...recentJoinRequests.map((request) => ({
        type: 'join-request',
        label: `${request.first_name} ${request.last_name}`.trim(),
        meta: request.processing_status || 'new',
        date: recentDate(request),
      })),
      ...recentContactMessages.map((message) => ({
        type: 'contact',
        label: message.subject || message.name,
        meta: message.is_read ? 'lu' : 'non lu',
        date: recentDate(message),
      })),
      ...recentAppointments.map((booking) => ({
        type: 'appointment',
        label: booking.user_name,
        meta: booking.slot ? `${booking.slot.date} ${booking.slot.start_time}` : 'Creneau indisponible',
        date: booking.booked_at,
      })),
    ]
      .filter((item) => item.date)
      .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
      .slice(0, 8);

    res.json({
      success: true,
      data: {
        generatedAt: new Date().toISOString(),
        registrations: {
          total: totalRegistrations,
          active: activeRegistrations,
          last30Days: recentRegistrations,
        },
        requests: {
          total: requestsTotal,
          resolved: requestsResolved,
          pending: Math.max(requestsTotal - requestsResolved, 0),
          unread: joinRequestsUnread + contactMessagesUnread,
          join: {
            total: joinRequestsTotal,
            resolved: joinRequestsResolved,
            open: joinRequestsOpen,
            unread: joinRequestsUnread,
          },
          contact: {
            total: contactMessagesTotal,
            resolved: contactMessagesRead,
            unread: contactMessagesUnread,
          },
        },
        appointments: {
          confirmed: appointmentsConfirmed,
          slotsTotal: appointmentSlotsTotal,
          slotsActive: appointmentSlotsActive,
          slotsAvailable: availableSlots,
          occupancyRate: appointmentSlotsActive > 0
            ? Math.round((appointmentsConfirmed / appointmentSlotsActive) * 100)
            : 0,
        },
        countries,
        userStatuses,
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
