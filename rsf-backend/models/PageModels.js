const { DataTypes } = require('sequelize');

const PAGE_TABLE_CONFIGS = {
  accueil: {
    modelName: 'PageAccueil',
    tableName: 'page_accueil',
    fields: {
      hero: 'hero',
      heroActions: 'hero_actions',
      stats: 'stats',
      statsCards: 'stats_cards',
      navigation: 'navigation',
      values: 'values_section',
      cta: 'cta',
    },
  },
  'qui-sommes-nous': {
    modelName: 'PageQuiSommesNous',
    tableName: 'page_qui_sommes_nous',
    fields: {
      hero: 'hero',
      story: 'story',
      values: 'values_section',
      goals: 'goals',
    },
  },
  organisation: {
    modelName: 'PageOrganisation',
    tableName: 'page_organisation',
    fields: {
      hero: 'hero',
      leadership: 'leadership',
      teamSection: 'team_section',
    },
  },
  'nos-missions': {
    modelName: 'PageMissions',
    tableName: 'page_missions',
    fields: {
      hero: 'hero',
      cta: 'cta',
    },
  },
  'actions-solidaires': {
    modelName: 'PageActionsSolidaires',
    tableName: 'page_actions_solidaires',
    fields: {
      hero: 'hero',
      cta: 'cta',
    },
  },
  'soutien-aux-membres': {
    modelName: 'PageSoutienMembres',
    tableName: 'page_soutien_membres',
    fields: {
      hero: 'hero',
      services: 'services',
      help: 'help',
      process: 'process_section',
    },
  },
  'actions-internationales': {
    modelName: 'PageActionsInternationales',
    tableName: 'page_actions_internationales',
    fields: {
      hero: 'hero',
      content: 'content',
      highlight: 'highlight',
      engagements: 'engagements',
    },
  },
  evenements: {
    modelName: 'PageEvenements',
    tableName: 'page_evenements',
    fields: {
      hero: 'hero',
      featured: 'featured',
      regular: 'regular',
      cta: 'cta',
    },
  },
  'rencontre-annuelle': {
    modelName: 'PageRencontreAnnuelle',
    tableName: 'page_rencontre_annuelle',
    fields: {
      content: 'content',
    },
  },
  temoignages: {
    modelName: 'PageTemoignages',
    tableName: 'page_temoignages',
    fields: {
      hero: 'hero',
      cta: 'cta',
    },
  },
  'nous-rejoindre': {
    modelName: 'PageNousRejoindre',
    tableName: 'page_nous_rejoindre',
    fields: {
      hero: 'hero',
      volunteer: 'volunteer',
      form: 'form_config',
    },
  },
  actualites: {
    modelName: 'PageActualites',
    tableName: 'page_actualites',
    fields: {
      hero: 'hero',
      cta: 'cta',
    },
  },
  don: {
    modelName: 'PageDon',
    tableName: 'page_don',
    fields: {
      hero: 'hero',
      intro: 'intro',
      impact: 'impact',
    },
  },
  contact: {
    modelName: 'PageContact',
    tableName: 'page_contact',
    fields: {
      hero: 'hero',
      details: 'details',
    },
  },
};

const parseStoredValue = (value) => {
  if (value === null || value === undefined || typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
};

const serializeStoredValue = (value) => (
  value !== null && typeof value === 'object'
    ? JSON.stringify(value)
    : value
);

const jsonColumn = (columnName) => ({
  type: DataTypes.TEXT('long'),
  allowNull: true,
  get() {
    return parseStoredValue(this.getDataValue(columnName));
  },
  set(value) {
    this.setDataValue(columnName, serializeStoredValue(value));
  },
});

const definePageModel = (sequelize, config) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  };

  Object.values(config.fields).forEach((columnName) => {
    attributes[columnName] = jsonColumn(columnName);
  });

  return sequelize.define(config.modelName, attributes, {
    tableName: config.tableName,
  });
};

const definePageModels = (sequelize) => (
  Object.values(PAGE_TABLE_CONFIGS).reduce((models, config) => {
    models[config.modelName] = definePageModel(sequelize, config);
    return models;
  }, {})
);

module.exports = {
  PAGE_TABLE_CONFIGS,
  definePageModels,
  parseStoredValue,
  serializeStoredValue,
};
