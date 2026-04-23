// models/EventProgram.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EventProgram = sequelize.define('EventProgram', {
    id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    event_id:   { type: DataTypes.INTEGER, allowNull: false },
    icon:       { type: DataTypes.STRING(100), defaultValue: 'fas fa-bullseye' },
    title:      { type: DataTypes.STRING(200), allowNull: false },
    subtitle:   { type: DataTypes.STRING(200), allowNull: true },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'event_programs' });
  return EventProgram;
};
