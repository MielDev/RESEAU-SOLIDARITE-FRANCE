// routes/public.js
// ─── API publique lue par le site front (sans authentification) ───────────────
const router = require('express').Router();
const { PageContent, TeamMember, Mission, MissionItem, Testimonial, Event, EventProgram, Actuality, Setting, NavItem } = require('../models');

// Contenu d'une page
router.get('/pages/:pageKey', async (req, res, next) => {
  try {
    const fields = await PageContent.findAll({ where: { page_key: req.params.pageKey }, order: [['sort_order','ASC']] });
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
    rows.forEach(r => { data[r.key] = r.value; });
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
