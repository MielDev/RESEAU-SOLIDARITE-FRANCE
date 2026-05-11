// models/index.js
// ─── Registre central des modèles + associations ──────────────────────────────
const sequelize = require('../config/database');

// ── Import de tous les modèles ────────────────────────────────────────────────
const User         = require('./User')(sequelize);
const TeamMember   = require('./TeamMember')(sequelize);
const Mission      = require('./Mission')(sequelize);
const MissionItem  = require('./MissionItem')(sequelize);
const Action       = require('./Action')(sequelize);
const Testimonial  = require('./Testimonial')(sequelize);
const Event        = require('./Event')(sequelize);
const EventProgram = require('./EventProgram')(sequelize);
const EventPhoto   = require('./EventPhoto')(sequelize);
const Actuality    = require('./Actuality')(sequelize);
const DonMode      = require('./DonMode')(sequelize);
const Setting      = require('./Setting')(sequelize);
const NavItem        = require('./NavItem')(sequelize);
const ContactMessage = require('./ContactMessage')(sequelize);
const JoinRequest   = require('./JoinRequest')(sequelize);
const HelpUser      = require('./HelpUser')(sequelize);
const HelpPasswordReset = require('./HelpPasswordReset')(sequelize);
const AppointmentSlot = require('./AppointmentSlot')(sequelize);
const AppointmentBooking = require('./AppointmentBooking')(sequelize);
const Accueil      = require('./Accueil')(sequelize);
const { definePageModels } = require('./PageModels');
const PageTableModels = definePageModels(sequelize);

// ── Associations (relations) ──────────────────────────────────────────────────

// Mission 1→N MissionItem (points de liste)
Mission.hasMany(MissionItem, { foreignKey: 'mission_id', as: 'items', onDelete: 'CASCADE' });
MissionItem.belongsTo(Mission, { foreignKey: 'mission_id', as: 'mission' });

// Event 1→N EventProgram (programme de la journée)
Event.hasMany(EventProgram, { foreignKey: 'event_id', as: 'program', onDelete: 'CASCADE' });
EventProgram.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

// Event 1-N EventPhoto (galerie photos)
Event.hasMany(EventPhoto, { foreignKey: 'event_id', as: 'photos', onDelete: 'CASCADE' });
EventPhoto.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

HelpUser.hasMany(HelpPasswordReset, { foreignKey: 'help_user_id', as: 'password_resets', onDelete: 'CASCADE' });
HelpPasswordReset.belongsTo(HelpUser, { foreignKey: 'help_user_id', as: 'help_user' });

HelpUser.hasMany(AppointmentBooking, { foreignKey: 'help_user_id', as: 'appointment_bookings', onDelete: 'CASCADE' });
AppointmentBooking.belongsTo(HelpUser, { foreignKey: 'help_user_id', as: 'help_user' });

AppointmentSlot.hasOne(AppointmentBooking, { foreignKey: 'appointment_slot_id', as: 'booking', onDelete: 'CASCADE' });
AppointmentBooking.belongsTo(AppointmentSlot, { foreignKey: 'appointment_slot_id', as: 'slot' });

// ── Export ────────────────────────────────────────────────────────────────────
const db = {
  sequelize,
  User,
  TeamMember,
  Mission,
  MissionItem,
  Action,
  Testimonial,
  Event,
  EventProgram,
  EventPhoto,
  Actuality,
  DonMode,
  Setting,
  NavItem,
  ContactMessage,
  JoinRequest,
  HelpUser,
  HelpPasswordReset,
  AppointmentSlot,
  AppointmentBooking,
  Accueil,
  PageTableModels,
  ...PageTableModels,
};

module.exports = db;
