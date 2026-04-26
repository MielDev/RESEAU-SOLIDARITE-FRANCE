// models/JoinRequest.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JoinRequest = sequelize.define('JoinRequest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(50), allowNull: true },
    city: { type: DataTypes.STRING(150), allowNull: true },
    status: { type: DataTypes.STRING(100), allowNull: true },
    intent: { type: DataTypes.STRING(150), allowNull: false },
    interests: { type: DataTypes.JSON, allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    processing_status: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'new',
    },
    admin_notes: { type: DataTypes.TEXT, allowNull: true },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    processed_at: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'join_requests',
    indexes: [
      { fields: ['processing_status'] },
      { fields: ['is_read'] },
      { fields: ['created_at'] },
    ],
  });

  return JoinRequest;
};
