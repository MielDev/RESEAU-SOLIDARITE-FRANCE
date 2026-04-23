const router = require('express').Router();
const {
  PageContent,
  TeamMember,
  Mission,
  MissionItem,
  Testimonial,
  Event,
  EventProgram,
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

const buildPageData = (fields) => {
  const data = {};
  fields.forEach((field) => {
    data[field.field_key] = parseStoredValue(field.value);
  });
  return data;
};

router.get('/pages/:pageKey', async (req, res, next) => {
  try {
    const { pageKey } = req.params;
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

      return res.json({ success: true, data });
    }

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
      include: [{ model: EventProgram, as: 'program', order: [['sort_order', 'ASC']] }],
      order: [['event_date', 'ASC']],
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
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
