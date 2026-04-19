// models/Action.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Action = sequelize.define('Action', {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    icon:        { type: DataTypes.STRING(10),  defaultValue: '🤝' },
    title:       { type: DataTypes.STRING(200), allowNull: false },
    category:    { type: DataTypes.STRING(100), allowNull: true },
    description: { type: DataTypes.TEXT,        allowNull: false },
    page_type:   { type: DataTypes.ENUM('solidaire','international'), defaultValue: 'solidaire' },
    is_published:{ type: DataTypes.BOOLEAN, defaultValue: true },
    sort_order:  { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'actions' });
  return Action;
};
