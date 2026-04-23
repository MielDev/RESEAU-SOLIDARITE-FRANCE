// routes/public.js
// ─── API publique lue par le site front (sans authentification) ───────────────
const router = require('express').Router();
const { PageContent, TeamMember, Mission, MissionItem, Testimonial, Event, EventProgram, Actuality, Setting, NavItem } = require('../models');

// Contenu d'une page
router.get('/pages/:pageKey', async (req, res, next) => {
  try {
    const { pageKey } = req.params;

    // Si c'est la page d'accueil, on récupère les données structurées de la table Accueil
    if (pageKey === 'accueil') {
      const { Accueil } = require('../models');
      const accueilData = await Accueil.findOne({ where: { id: 1 } });
      if (accueilData) {
        // Transformer les données pour correspondre à la structure attendue par le front
        const formattedData = {
          hero: {
            badge: accueilData.hero_badge,
            title: accueilData.hero_title,
            text: accueilData.hero_text,
            features: accueilData.hero_features
          },
          stats: {
            members: accueilData.stats_members,
            domains: accueilData.stats_domains
          }
        };
        return res.json({ success: true, data: formattedData });
      }
    }

    const fields = await PageContent.findAll({ where: { page_key: pageKey }, order: [['sort_order','ASC']] });
    const data = {};
    fields.forEach(f => { data[f.field_key] = f.value; });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// Membres équipe
router.get('/team', async (req, res, next) => {
  try {
    const rows = await TeamMember.findAll({ where: { is_active: true }, order: [['is_president','DESC'],['sort_order','ASC']] });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// Missions
router.get('/missions', async (req, res, next) => {
  try {
    const rows = await Mission.findAll({
      where: { is_active: true },
      include: [{ model: MissionItem, as: 'items', order: [['sort_order','ASC']] }],
      order: [['sort_order','ASC']],
    });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// Témoignages publiés
router.get('/testimonials', async (req, res, next) => {
  try {
    const rows = await Testimonial.findAll({ where: { is_published: true }, order: [['sort_order','ASC']] });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// Événements publiés
router.get('/events', async (req, res, next) => {
  try {
    const rows = await Event.findAll({
      where: { is_published: true },
      include: [{ model: EventProgram, as: 'program', order: [['sort_order','ASC']] }],
      order: [['event_date','ASC']],
    });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// Actualités publiées
router.get('/actualities', async (req, res, next) => {
  try {
    const rows = await Actuality.findAll({ where: { is_published: true }, order: [['sort_order','ASC']] });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

// Paramètres globaux
router.get('/settings', async (req, res, next) => {
  try {
    const rows = await Setting.findAll();
    const data = {};
    rows.forEach(r => {
      let val = r.value;
      // Essayer de parser si c'est du JSON (pour socialLinks par exemple)
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try { val = JSON.parse(val); } catch (e) { /* ignore */ }
      }
      data[r.key] = val;
    });
    res.json({ success: true, data });
  } catch (err) { next(err); }
});

// Navigation
router.get('/nav', async (req, res, next) => {
  try {
    const rows = await NavItem.findAll({ where: { is_visible: true }, order: [['sort_order','ASC']] });
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
});

module.exports = router;
