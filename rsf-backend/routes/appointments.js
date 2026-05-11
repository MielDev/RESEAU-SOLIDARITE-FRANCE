const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/appointmentController');
const { authenticate } = require('../middleware/auth');
const { authenticateHelpUser } = require('../middleware/helpAuth');
const validate = require('../middleware/validate');

const slotValidators = [
  body('label').trim().isLength({ min: 2, max: 180 }).withMessage('Titre de creneau invalide.'),
  body('date').isISO8601().withMessage('Date invalide.'),
  body('startTime').optional().matches(/^\d{2}:\d{2}$/).withMessage('Heure de debut invalide.'),
  body('start_time').optional().matches(/^\d{2}:\d{2}$/).withMessage('Heure de debut invalide.'),
  body('endTime').optional().matches(/^\d{2}:\d{2}$/).withMessage('Heure de fin invalide.'),
  body('end_time').optional().matches(/^\d{2}:\d{2}$/).withMessage('Heure de fin invalide.'),
  body('location').optional({ values: 'falsy' }).trim().isLength({ max: 180 }).withMessage('Lieu invalide.'),
  body('notes').optional({ values: 'falsy' }).trim().isLength({ max: 2000 }).withMessage('Notes trop longues.'),
];

router.get('/slots', ctrl.listPublicSlots);

router.post('/bookings', authenticateHelpUser, [
  body('slotId').isInt({ min: 1 }).withMessage('Creneau invalide.'),
], validate, ctrl.bookSlot);

router.get('/bookings/me', authenticateHelpUser, ctrl.getMyBooking);
router.put('/bookings/me', authenticateHelpUser, [
  body('slotId').isInt({ min: 1 }).withMessage('Creneau invalide.'),
], validate, ctrl.rescheduleMyBooking);
router.delete('/bookings/me', authenticateHelpUser, ctrl.cancelMyBooking);

router.get('/admin/slots', authenticate, ctrl.listAdminSlots);
router.post('/admin/slots', authenticate, slotValidators, validate, ctrl.createSlot);
router.put('/admin/slots/:id', authenticate, [
  param('id').isInt({ min: 1 }),
  ...slotValidators,
], validate, ctrl.updateSlot);
router.delete('/admin/slots/:id', authenticate, [
  param('id').isInt({ min: 1 }),
], validate, ctrl.deleteSlot);

router.get('/admin/bookings', authenticate, ctrl.listBookings);
router.delete('/admin/bookings/:id', authenticate, [
  param('id').isInt({ min: 1 }),
], validate, ctrl.deleteBooking);

module.exports = router;
