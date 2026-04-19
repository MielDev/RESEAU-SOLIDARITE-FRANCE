// models/index.js
// ─── Registre central des modèles + associations ──────────────────────────────
const sequelize = require('../config/database');

// ── Import de tous les modèles ────────────────────────────────────────────────
const User         = require('./User')(sequelize);
const PageContent  = require('./PageContent')(sequelize);
const TeamMember   = require('./TeamMember')(sequelize);
const Mission      = require('./Mission')(sequelize);
const MissionItem  = require('./MissionItem')(sequelize);
const Action       = require('./Action')(sequelize);
const Testimonial  = require('./Testimonial')(sequelize);
const Event        = require('./Event')(sequelize);
const EventProgram = require('./EventProgram')(sequelize);
const Actuality    = require('./Actuality')(sequelize);
const DonMode      = require('./DonMode')(sequelize);
const Setting      = require('./Setting')(sequelize);
const NavItem        = require('./NavItem')(sequelize);
const ContactMessage = require('./ContactMessage')(sequelize);

// ── Associations (relations) ──────────────────────────────────────────────────

// Mission 1→N MissionItem (points de liste)
Mission.hasMany(MissionItem, { foreignKey: 'mission_id', as: 'items', onDelete: 'CASCADE' });
MissionItem.belongsTo(Mission, { foreignKey: 'mission_id', as: 'mission' });

// Event 1→N EventProgram (programme de la journée)
Event.hasMany(EventProgram, { foreignKey: 'event_id', as: 'program', onDelete: 'CASCADE' });
EventProgram.belongsTo(Event, { foreignKey: 'event_id', as: 'event' });

// ── Export ────────────────────────────────────────────────────────────────────
const db = {
  sequelize,
  User,
  PageContent,
  TeamMember,
  Mission,
  MissionItem,
  Action,
  Testimonial,
  Event,
  EventProgram,
  Actuality,
  DonMode,
  Setting,
  NavItem,
  ContactMessage,
};

module.exports = db;
