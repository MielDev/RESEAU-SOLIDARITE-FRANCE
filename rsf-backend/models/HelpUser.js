const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const HelpUser = sequelize.define('HelpUser', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING(100), allowNull: false },
    last_name: { type: DataTypes.STRING(100), allowNull: false },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(50), allowNull: false },
    birth_date: { type: DataTypes.DATEONLY, allowNull: false },
    nationality: { type: DataTypes.STRING(150), allowNull: false },
    status: { type: DataTypes.STRING(100), allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    last_login: { type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'help_users',
    indexes: [
      { unique: true, fields: ['email'] },
      { fields: ['status'] },
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  });

  HelpUser.prototype.checkPassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
  };

  HelpUser.prototype.toSafeJSON = function () {
    const { password, ...safe } = this.toJSON();
    return safe;
  };

  return HelpUser;
};
