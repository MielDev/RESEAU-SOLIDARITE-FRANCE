const { PageContent } = require('../models');

const parseStoredValue = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return value;
  }

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed);
    } catch (error) {
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

const buildPageData = (fields) => {
  const data = {};
  fields.forEach((field) => {
    data[field.field_key] = parseStoredValue(field.value);
  });
  return data;
};

const ACCUEIL_MODEL_FIELDS = new Set([
  'hero_badge',
  'hero_title',
  'hero_text',
  'hero_features',
  'stats_members',
  'stats_domains',
]);

const VALID_PAGES = [
  'accueil',
  'qui-sommes-nous',
  'organisation',
  'missions',
  'nos-missions',
  'actions-solidaires',
  'soutien',
  'soutien-aux-membres',
  'evenements',
  'rencontre-annuelle',
  'actions-internationales',
  'temoignages',
  'nous-rejoindre',
  'actualites',
  'don',
  'contact',
];

const getPage = async (req, res, next) => {
  try {
    const { pageKey } = req.params;

    if (!VALID_PAGES.includes(pageKey)) {
      return res.status(404).json({ success: false, message: 'Page introuvable.' });
    }

    const fields = await PageContent.findAll({
      where: { page_key: pageKey },
      order: [['sort_order', 'ASC']],
    });
    const data = buildPageData(fields);

    if (pageKey === 'accueil') {
      const { Accueil } = require('../models');
      const accueilData = await Accueil.findOne({ where: { id: 1 } });

      if (accueilData) {
        data.hero = {
          ...(data.hero || {}),
          badge: accueilData.hero_badge,
          title: accueilData.hero_title,
          text: accueilData.hero_text,
          features: accueilData.hero_features,
        };
        data.stats = {
          ...(data.stats || {}),
          members: accueilData.stats_members,
          domains: accueilData.stats_domains,
        };
      }
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updatePage = async (req, res, next) => {
  try {
    const { pageKey } = req.params;

    if (!VALID_PAGES.includes(pageKey)) {
      return res.status(404).json({ success: false, message: 'Page introuvable.' });
    }

    const { fields } = req.body;
    if (!fields || typeof fields !== 'object') {
      return res.status(400).json({ success: false, message: 'Champ "fields" requis.' });
    }

    if (pageKey === 'accueil') {
      const { Accueil } = require('../models');
      const heroFields = fields.hero && typeof fields.hero === 'object' ? fields.hero : null;
      const statsFields = fields.stats && typeof fields.stats === 'object' ? fields.stats : null;
      const dataToUpdate = {};

      if ('hero_badge' in fields) dataToUpdate.hero_badge = fields.hero_badge;
      else if (heroFields && 'badge' in heroFields) dataToUpdate.hero_badge = heroFields.badge;

      if ('hero_title' in fields) dataToUpdate.hero_title = fields.hero_title;
      else if (heroFields && 'title' in heroFields) dataToUpdate.hero_title = heroFields.title;

      if ('hero_text' in fields) dataToUpdate.hero_text = fields.hero_text;
      else if (heroFields && 'text' in heroFields) dataToUpdate.hero_text = heroFields.text;

      if ('hero_features' in fields) dataToUpdate.hero_features = fields.hero_features;
      else if (heroFields && 'features' in heroFields) dataToUpdate.hero_features = heroFields.features;

      if ('stats_members' in fields) dataToUpdate.stats_members = fields.stats_members;
      else if (statsFields && 'members' in statsFields) dataToUpdate.stats_members = statsFields.members;

      if ('stats_domains' in fields) dataToUpdate.stats_domains = fields.stats_domains;
      else if (statsFields && 'domains' in statsFields) dataToUpdate.stats_domains = statsFields.domains;

      if (Object.keys(dataToUpdate).length > 0) {
        await Accueil.upsert({ id: 1, ...dataToUpdate });
      }

      const extraFields = Object.entries(fields).filter(
        ([fieldKey]) => !ACCUEIL_MODEL_FIELDS.has(fieldKey) && fieldKey !== 'hero' && fieldKey !== 'stats'
      );

      await Promise.all(
        extraFields.map(([field_key, value]) =>
          PageContent.upsert({
            page_key: pageKey,
            field_key,
            value: serializeStoredValue(value),
          })
        )
      );

      return res.json({ success: true, message: `Page "${pageKey}" mise a jour.` });
    }

    const operations = Object.entries(fields).map(([field_key, value]) =>
      PageContent.upsert({
        page_key: pageKey,
        field_key,
        value: serializeStoredValue(value),
      })
    );

    await Promise.all(operations);

    res.json({ success: true, message: `Page "${pageKey}" mise a jour.` });
  } catch (err) {
    next(err);
  }
};

const listPages = async (req, res) => {
  res.json({ success: true, data: VALID_PAGES });
};

module.exports = { getPage, updatePage, listPages };
