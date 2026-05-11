const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AppointmentBooking = sequelize.define('AppointmentBooking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    appointment_slot_id: { type: DataTypes.INTEGER, allowNull: false },
    help_user_id: { type: DataTypes.INTEGER, allowNull: false },
    user_name: { type: DataTypes.STRING(220), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(50), allowNull: false },
    booked_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    status: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: 'confirmed',
    },
  }, {
    tableName: 'appointment_bookings',
    indexes: [
      { unique: true, fields: ['appointment_slot_id'] },
      { fields: ['help_user_id'] },
      { fields: ['status'] },
      { fields: ['booked_at'] },
    ],
  });

  return AppointmentBooking;
};
