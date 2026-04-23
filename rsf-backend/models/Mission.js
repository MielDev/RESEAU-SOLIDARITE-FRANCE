// models/Mission.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Mission = sequelize.define('Mission', {
    id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    icon:       { type: DataTypes.STRING(255), allowNull: false, defaultValue: 'fas fa-bullseye' },
    title:      { type: DataTypes.STRING(200), allowNull: false },
    description:{ type: DataTypes.TEXT,         allowNull: true },
    color_name: { type: DataTypes.STRING(50),  defaultValue: 'primary', comment: 'primary|secondary|accent|support|gray' },
    sort_order: { type: DataTypes.INTEGER,     defaultValue: 0 },
    is_active:  { type: DataTypes.BOOLEAN,     defaultValue: true },
  }, { tableName: 'missions' });
  return Mission;
};
