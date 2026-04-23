// models/Accueil.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Accueil = sequelize.define('Accueil', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Hero Section
    hero_badge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hero_title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hero_text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hero_features: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
      comment: 'JSON array of features {bg, icon, title, text}',
      get() {
        const val = this.getDataValue('hero_features');
        return val ? JSON.parse(val) : [];
      },
      set(val) {
        this.setDataValue('hero_features', JSON.stringify(val));
      }
    },
    // Stats Section
    stats_members: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stats_domains: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'accueil',
    timestamps: true,
  });

  return Accueil;
};
