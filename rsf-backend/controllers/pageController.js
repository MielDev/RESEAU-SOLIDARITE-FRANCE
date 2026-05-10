const pageStore = require('../services/pageTableStore');

const getPage = async (req, res, next) => {
  try {
    const { pageKey } = req.params;

    if (!pageStore.isValidPage(pageKey)) {
      return res.status(404).json({ success: false, message: 'Page introuvable.' });
    }

    const data = await pageStore.getPageData(pageKey);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const updatePage = async (req, res, next) => {
  try {
    const { pageKey } = req.params;

    if (!pageStore.isValidPage(pageKey)) {
      return res.status(404).json({ success: false, message: 'Page introuvable.' });
    }

    const { fields } = req.body;
    if (!fields || typeof fields !== 'object') {
      return res.status(400).json({ success: false, message: 'Champ "fields" requis.' });
    }

    const updated = await pageStore.updatePageData(pageKey, fields);
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Aucun champ reconnu pour cette page.',
      });
    }

    res.json({ success: true, message: `Page "${pageStore.normalizePageKey(pageKey)}" mise a jour.` });
  } catch (err) {
    next(err);
  }
};

const listPages = async (req, res) => {
  res.json({ success: true, data: pageStore.listPages() });
};

module.exports = { getPage, updatePage, listPages };
