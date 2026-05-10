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
