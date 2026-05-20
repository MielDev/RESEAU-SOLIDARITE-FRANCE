const db = require('../models');
const {
  PAGE_TABLE_CONFIGS,
  serializeStoredValue,
} = require('../models/PageModels');

const normalizePageKey = (pageKey) => (
  pageKey === 'soutien' ? 'soutien-aux-membres' : pageKey
);

const listPages = () => Object.keys(PAGE_TABLE_CONFIGS);

const isValidPage = (pageKey) => Boolean(PAGE_TABLE_CONFIGS[normalizePageKey(pageKey)]);

const getConfig = (pageKey) => PAGE_TABLE_CONFIGS[normalizePageKey(pageKey)];

const getModel = (pageKey) => {
  const config = getConfig(pageKey);
  return config ? db[config.modelName] : null;
};

const hasPageData = (data) => (
  Object.values(data).some((value) => value !== null && value !== undefined && value !== '')
);

const rowToPageData = (pageKey, row) => {
  if (!row) {
    return {};
  }

  const config = getConfig(pageKey);
  const plain = row.get({ plain: true });
  const data = {};

  Object.entries(config.fields).forEach(([fieldKey, columnName]) => {
    const value = plain[columnName];
    if (value !== null && value !== undefined) {
      data[fieldKey] = value;
    }
  });

  return normalizeLegacyPageData(pageKey, data);
};

const normalizeSearchText = (value) => (
  typeof value === 'string'
    ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    : ''
);

const referencesLegacyEvents = (value) => normalizeSearchText(value).includes('evenement');

const normalizeLegacyEvenementsPage = (data) => {
  const hero = data.hero && typeof data.hero === 'object' ? { ...data.hero } : data.hero;
  const regular = data.regular && typeof data.regular === 'object' ? { ...data.regular } : data.regular;
  const cta = data.cta && typeof data.cta === 'object' ? { ...data.cta } : data.cta;

  if (hero && typeof hero === 'object') {
    if (referencesLegacyEvents(hero.title)) {
      hero.title = 'Actualites';
    }

    if (referencesLegacyEvents(hero.text)) {
      hero.text = 'Les actualites du reseau mettent en avant les rencontres, annonces et informations utiles.';
    }

    if (normalizeSearchText(hero.badge) === 'rencontres') {
      hero.badge = 'Informations';
    }
  }

  if (regular && typeof regular === 'object') {
    if (normalizeSearchText(regular.label) === 'editions') {
      regular.label = 'Publications';
    }

    if (normalizeSearchText(regular.title).includes('rencontres')) {
      regular.title = 'Toutes les actualites du reseau';
    }
  }

  if (cta && typeof cta === 'object' && referencesLegacyEvents(cta.title)) {
    cta.title = 'Une information a partager ?';
  }

  return { ...data, hero, regular, cta };
};

const normalizeLegacyJoinPage = (data) => {
  const volunteer = data.volunteer && typeof data.volunteer === 'object' ? { ...data.volunteer } : data.volunteer;
  const form = data.form && typeof data.form === 'object' ? { ...data.form } : data.form;

  if (volunteer && typeof volunteer === 'object' && Array.isArray(volunteer.benefits)) {
    volunteer.benefits = volunteer.benefits.map((benefit) => {
      if (!benefit || typeof benefit !== 'object' || !referencesLegacyEvents(benefit.description)) {
        return benefit;
      }

      return {
        ...benefit,
        description: 'Participer aux collectes, distributions et actualites du reseau.',
      };
    });
  }

  if (form && typeof form === 'object' && Array.isArray(form.interestOptions)) {
    form.interestOptions = form.interestOptions.map((option) =>
      referencesLegacyEvents(option) ? 'Actualites' : option
    );
  }

  return { ...data, volunteer, form };
};

const normalizeLegacyPageData = (pageKey, data) => {
  if (pageKey === 'evenements') {
    return normalizeLegacyEvenementsPage(data);
  }

  if (pageKey === 'nous-rejoindre') {
    return normalizeLegacyJoinPage(data);
  }

  return data;
};

const getPageData = async (pageKey) => {
  const normalizedPageKey = normalizePageKey(pageKey);
  const Model = getModel(normalizedPageKey);

  if (!Model) {
    return null;
  }

  const row = await Model.findOne({ where: { id: 1 } });
  return rowToPageData(normalizedPageKey, row);
};

const toModelPayload = (pageKey, fields) => {
  const config = getConfig(pageKey);
  const payload = { id: 1 };

  Object.entries(config.fields).forEach(([fieldKey, columnName]) => {
    if (Object.prototype.hasOwnProperty.call(fields, fieldKey)) {
      payload[columnName] = serializeStoredValue(fields[fieldKey]);
    }
  });

  return payload;
};

const updatePageData = async (pageKey, fields) => {
  const normalizedPageKey = normalizePageKey(pageKey);
  const Model = getModel(normalizedPageKey);

  if (!Model) {
    return false;
  }

  const payload = toModelPayload(normalizedPageKey, fields);

  if (Object.keys(payload).length <= 1) {
    return false;
  }

  await Model.upsert(payload);
  return true;
};

const clearPageTables = async () => {
  await Promise.all(
    Object.values(PAGE_TABLE_CONFIGS).map((config) => {
      const Model = db[config.modelName];
      return Model ? Model.destroy({ where: {} }) : Promise.resolve();
    })
  );
};

module.exports = {
  clearPageTables,
  getPageData,
  hasPageData,
  isValidPage,
  listPages,
  normalizePageKey,
  updatePageData,
};
