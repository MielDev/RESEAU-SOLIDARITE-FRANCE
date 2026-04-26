// models/EventPhoto.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EventPhoto = sequelize.define('EventPhoto', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    event_id: { type: DataTypes.INTEGER, allowNull: false },
    image_url: { type: DataTypes.STRING(500), allowNull: false },
    alt_text: { type: DataTypes.STRING(255), allowNull: true },
    caption: { type: DataTypes.STRING(255), allowNull: true },
    sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, {
    tableName: 'event_photos',
    indexes: [
      { fields: ['event_id'] },
      { fields: ['sort_order'] },
    ],
  });

  return EventPhoto;
};
