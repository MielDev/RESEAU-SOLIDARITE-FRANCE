const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HelpPasswordReset = sequelize.define('HelpPasswordReset', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    help_user_id: { type: DataTypes.INTEGER, allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
    token: { type: DataTypes.STRING(20), allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used_at: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'help_password_resets',
    indexes: [
      { fields: ['email'] },
      { fields: ['token'] },
      { fields: ['expires_at'] },
    ],
  });

  return HelpPasswordReset;
};
