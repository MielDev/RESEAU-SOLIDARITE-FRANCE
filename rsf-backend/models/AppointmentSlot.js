const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AppointmentSlot = sequelize.define('AppointmentSlot', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label: { type: DataTypes.STRING(180), allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    start_time: { type: DataTypes.STRING(5), allowNull: false },
    end_time: { type: DataTypes.STRING(5), allowNull: false },
    location: { type: DataTypes.STRING(180), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, {
    tableName: 'appointment_slots',
    indexes: [
      { fields: ['date'] },
      { fields: ['is_active'] },
      { unique: true, fields: ['date', 'start_time', 'end_time'] },
    ],
  });

  return AppointmentSlot;
};
