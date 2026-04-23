const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ActionSolidaire = sequelize.define('ActionSolidaire', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    iconColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tagBg: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tagColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gradient: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'actions_solidaires',
    timestamps: true,
  });

  return ActionSolidaire;
};
