// models/Event.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title:       { type: DataTypes.STRING(300), allowNull: false },
    edition:     { type: DataTypes.STRING(50),  allowNull: true, comment: '2ᵉ Édition' },
    event_date:  { type: DataTypes.DATEONLY,    allowNull: false },
    time_start:  { type: DataTypes.STRING(10),  allowNull: true, defaultValue: '10:00' },
    time_end:    { type: DataTypes.STRING(10),  allowNull: true, defaultValue: '22:00' },
    location:    { type: DataTypes.STRING(300), allowNull: false },
    description: { type: DataTypes.TEXT,        allowNull: true },
    badge_label: { type: DataTypes.STRING(100), allowNull: true },
    contact_email:  { type: DataTypes.STRING(255), allowNull: true },
    contact_website:{ type: DataTypes.STRING(255), allowNull: true },
    cta_text:    { type: DataTypes.STRING(100), defaultValue: 'Je participe →' },
    cta_href:    { type: DataTypes.STRING(255), defaultValue: 'nous-rejoindre.html' },
    is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_published:{ type: DataTypes.BOOLEAN, defaultValue: true },
    sort_order:  { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'events' });
  return Event;
};
