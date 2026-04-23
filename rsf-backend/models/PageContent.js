// models/PageContent.js
// Stocke le contenu éditable de chaque page (clé/valeur par page)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PageContent = sequelize.define('PageContent', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    page_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Identifiant de la page (ex: accueil, qui-sommes-nous)',
    },
    field_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Identifiant du champ (ex: hero_title, hero_desc)',
    },
    field_type: {
      type: DataTypes.ENUM('text', 'textarea', 'html', 'url', 'color', 'boolean', 'number'),
      defaultValue: 'text',
    },
    value: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    label: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Libellé affiché dans le back-office',
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    tableName: 'page_contents',
    indexes: [
      { unique: true, fields: ['page_key', 'field_key'] },
      { fields: ['page_key'] },
    ],
  });

  return PageContent;
};
