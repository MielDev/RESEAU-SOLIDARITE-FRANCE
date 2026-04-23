// models/DonMode.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DonMode = sequelize.define('DonMode', {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    icon:        { type: DataTypes.STRING(100), defaultValue: 'fas fa-heart' },
    title:       { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT,        allowNull: false },
    link_href:   { type: DataTypes.STRING(255), allowNull: true },
    btn_text:    { type: DataTypes.STRING(100), defaultValue: 'En savoir plus' },
    border_color:{ type: DataTypes.STRING(20),  defaultValue: '#2F5DFF' },
    sort_order:  { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active:   { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { tableName: 'don_modes' });
  return DonMode;
};
