// models/MissionItem.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MissionItem = sequelize.define('MissionItem', {
    id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mission_id: { type: DataTypes.INTEGER, allowNull: false },
    text:       { type: DataTypes.STRING(500), allowNull: false },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'mission_items' });
  return MissionItem;
};
