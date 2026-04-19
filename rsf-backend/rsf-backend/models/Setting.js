// models/Setting.js
// Table clé/valeur pour tous les paramètres globaux du site
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Setting = sequelize.define('Setting', {
    id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    key:      { type: DataTypes.STRING(100), allowNull: false, unique: true },
    value:    { type: DataTypes.TEXT, allowNull: true },
    type:     { type: DataTypes.ENUM('text','number','boolean','color','json'), defaultValue: 'text' },
    group:    { type: DataTypes.STRING(50), defaultValue: 'general', comment: 'general|appearance|contact|footer|nav' },
    label:    { type: DataTypes.STRING(200), allowNull: true },
  }, { tableName: 'settings', indexes: [{ unique: true, fields: ['key'] }] });
  return Setting;
};
