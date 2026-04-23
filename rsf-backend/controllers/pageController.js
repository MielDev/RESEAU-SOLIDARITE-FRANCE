// controllers/pageController.js
const { PageContent } = require('../models');

// Liste des pages valides
const VALID_PAGES = [
  'accueil','qui-sommes-nous','organisation','missions',
  'actions-solidaires','soutien','evenements','rencontre-annuelle',
  'actions-internationales','temoignages','nous-rejoindre',
  'actualites','don','contact',
];

// ── GET /api/pages/:pageKey ───────────────────────────────────────────────────
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
    // Transformer en objet { field_key: value }
    const data = {};
    fields.forEach(f => { data[f.field_key] = f.value; });
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

// ── PUT /api/pages/:pageKey ───────────────────────────────────────────────────
// body: { fields: { hero_title: "...", hero_desc: "..." } }
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

    // Gestion spécifique pour la page d'accueil
    if (pageKey === 'accueil') {
      const { Accueil } = require('../models');
      const dataToUpdate = {
        hero_badge: fields.hero_badge,
        hero_title: fields.hero_title,
        hero_text: fields.hero_text,
        hero_features: fields.hero_features,
        stats_members: fields.stats_members,
        stats_domains: fields.stats_domains
      };
      await Accueil.upsert({ id: 1, ...dataToUpdate });
      return res.json({ success: true, message: `Page "${pageKey}" mise à jour.` });
    }

    // Upsert chaque champ pour les autres pages
    const operations = Object.entries(fields).map(([field_key, value]) =>
      PageContent.upsert({ page_key: pageKey, field_key, value })
    );
    await Promise.all(operations);

    res.json({ success: true, message: `Page "${pageKey}" mise à jour.` });
  } catch (err) { next(err); }
};

// ── GET /api/pages (toutes les pages disponibles) ────────────────────────────
const listPages = async (req, res) => {
  res.json({ success: true, data: VALID_PAGES });
};

module.exports = { getPage, updatePage, listPages };
