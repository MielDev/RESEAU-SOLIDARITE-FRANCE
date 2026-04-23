// models/Actuality.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Actuality = sequelize.define('Actuality', {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    icon:        { type: DataTypes.STRING(100), defaultValue: 'fas fa-newspaper' },
    title:       { type: DataTypes.STRING(300), allowNull: false },
    category:    { type: DataTypes.STRING(100), allowNull: true },
    summary:     { type: DataTypes.TEXT,        allowNull: false },
    link_href:   { type: DataTypes.STRING(255), allowNull: true },
    published_at:{ type: DataTypes.DATEONLY,    allowNull: true },
    is_published:{ type: DataTypes.BOOLEAN, defaultValue: true },
    sort_order:  { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'actualities' });
  return Actuality;
};
