// models/ContactMessage.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContactMessage = sequelize.define('ContactMessage', {
    id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:    { type: DataTypes.STRING(150), allowNull: false },
    email:   { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
    subject: { type: DataTypes.STRING(200), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, {
    tableName: 'contact_messages',
    indexes: [{ fields: ['is_read'] }, { fields: ['created_at'] }],
  });
  return ContactMessage;
};
