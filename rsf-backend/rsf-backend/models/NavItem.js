// models/NavItem.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NavItem = sequelize.define('NavItem', {
    id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label:      { type: DataTypes.STRING(100), allowNull: false },
    href:       { type: DataTypes.STRING(255), allowNull: false },
    icon:       { type: DataTypes.STRING(10),  allowNull: true },
    is_visible: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_cta:     { type: DataTypes.BOOLEAN, defaultValue: false, comment: 'Bouton mis en avant (Faire un don)' },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'nav_items' });
  return NavItem;
};
