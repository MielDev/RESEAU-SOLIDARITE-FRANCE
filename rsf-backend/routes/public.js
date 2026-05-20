const router = require('express').Router();
const pageStore = require('../services/pageTableStore');
const {
  TeamMember,
  Mission,
  MissionItem,
  Testimonial,
  Event,
  EventProgram,
  EventPhoto,
  Actuality,
  Setting,
  NavItem,
  DonMode,
  Action,
} = require('../models');

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

router.get('/pages/:pageKey', async (req, res, next) => {
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
});

router.get('/team', async (req, res, next) => {
  try {
    const rows = await TeamMember.findAll({
      where: { is_active: true },
      order: [['is_president', 'DESC'], ['sort_order', 'ASC']],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.get('/missions', async (req, res, next) => {
  try {
    const rows = await Mission.findAll({
      where: { is_active: true },
      include: [{ model: MissionItem, as: 'items', order: [['sort_order', 'ASC']] }],
      order: [['sort_order', 'ASC']],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.get('/testimonials', async (req, res, next) => {
  try {
    const rows = await Testimonial.findAll({
      where: { is_published: true },
      order: [['sort_order', 'ASC']],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.get('/events', async (req, res, next) => {
  try {
    const rows = await Event.findAll({
      where: { is_published: true },
      include: [
        { model: EventProgram, as: 'program' },
        { model: EventPhoto, as: 'photos' },
      ],
      order: [
        ['event_date', 'ASC'],
        [{ model: EventProgram, as: 'program' }, 'sort_order', 'ASC'],
        [{ model: EventPhoto, as: 'photos' }, 'sort_order', 'ASC'],
      ],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.get('/actualities', async (req, res, next) => {
  try {
    const rows = await Actuality.findAll({
      where: { is_published: true },
      order: [['sort_order', 'ASC']],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.get('/don-modes', async (req, res, next) => {
  try {
    const rows = await DonMode.findAll({
      where: { is_active: true },
      order: [['sort_order', 'ASC']],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.get('/actions', async (req, res, next) => {
  try {
    const where = { is_published: true };

    if (req.query.page_type) {
      where.page_type = req.query.page_type;
    }

    const rows = await Action.findAll({
      where,
      order: [['sort_order', 'ASC'], ['id', 'ASC']],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

router.get('/settings', async (req, res, next) => {
  try {
    const rows = await Setting.findAll();
    const data = {};
    rows.forEach((row) => {
      data[row.key] = parseStoredValue(row.value);
    });
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

router.get('/nav', async (req, res, next) => {
  try {
    const rows = await NavItem.findAll({
      where: { is_visible: true },
      order: [['sort_order', 'ASC']],
    });
    const navItems = rows.map((row) => row.get({ plain: true }));
    const hasLegacyEventItem = navItems.some((item) => item.href === '/evenements');
    const data = navItems
      .filter((item) => !(hasLegacyEventItem && item.href === '/actualites'))
      .map((item) =>
        item.href === '/evenements'
          ? { ...item, label: 'Actualites', href: '/actualites', icon: 'fas fa-newspaper' }
          : item
      );

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
