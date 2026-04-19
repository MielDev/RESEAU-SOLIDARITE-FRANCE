// models/TeamMember.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TeamMember = sequelize.define('TeamMember', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:      { type: DataTypes.STRING(150), allowNull: false },
    initials:  { type: DataTypes.STRING(4),   allowNull: false },
    role:      { type: DataTypes.STRING(200), allowNull: false },
    color1:    { type: DataTypes.STRING(20),  defaultValue: '#2F5DFF' },
    color2:    { type: DataTypes.STRING(20),  defaultValue: '#1E3A8A' },
    is_president: { type: DataTypes.BOOLEAN, defaultValue: false },
    bio:       { type: DataTypes.TEXT,  allowNull: true },
    diplomas:  { type: DataTypes.TEXT,  allowNull: true, comment: 'JSON array of diploma strings' },
    sort_order:{ type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, { tableName: 'team_members' });
  return TeamMember;
};
