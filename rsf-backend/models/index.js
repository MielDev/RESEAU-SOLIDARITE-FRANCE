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
  Accueil,
  PageTableModels,
  ...PageTableModels,
};

module.exports = db;
