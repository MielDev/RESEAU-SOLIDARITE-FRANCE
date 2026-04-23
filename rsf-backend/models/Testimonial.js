// models/Testimonial.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Testimonial = sequelize.define('Testimonial', {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name:  { type: DataTypes.STRING(100), allowNull: false },
    initials:    { type: DataTypes.STRING(4),   allowNull: false },
    profile:     { type: DataTypes.ENUM('étudiant(e)','salarié(e)','bénévole','autre'), defaultValue: 'étudiant(e)' },
    quote:       { type: DataTypes.TEXT, allowNull: false },
    color1:      { type: DataTypes.STRING(20), defaultValue: '#2F5DFF' },
    color2:      { type: DataTypes.STRING(20), defaultValue: '#1E3A8A' },
    is_published:{ type: DataTypes.BOOLEAN, defaultValue: true },
    sort_order:  { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'testimonials' });
  return Testimonial;
};
