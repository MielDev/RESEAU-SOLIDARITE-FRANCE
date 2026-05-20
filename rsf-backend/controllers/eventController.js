const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { Event, EventProgram, EventPhoto } = require('../models');
const { createError } = require('../middleware/errorHandler');

const eventImagesDir = path.join(__dirname, '..', 'public', 'images', 'events');
const allowedImageTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);
const maxImageSize = 8 * 1024 * 1024;

const includeEventDetails = [
  { model: EventProgram, as: 'program' },
  { model: EventPhoto, as: 'photos' },
];

const eventOrder = [
  ['sort_order', 'ASC'],
  [{ model: EventProgram, as: 'program' }, 'sort_order', 'ASC'],
  [{ model: EventPhoto, as: 'photos' }, 'sort_order', 'ASC'],
];

const normalizeProgram = (program = []) =>
  program
    .filter((item) => item && (item.title || item.subtitle || item.icon))
    .map((item, index) => ({
      icon: item.icon || 'fas fa-circle',
      title: item.title || '',
      subtitle: item.subtitle || '',
      sort_order: index,
    }));

const normalizePhotos = (photos = []) =>
  photos
    .filter((item) => item && (item.image_url || item.imageUrl || item.url || item.src))
    .map((item, index) => ({
      image_url: item.image_url || item.imageUrl || item.url || item.src,
      alt_text: item.alt_text || item.altText || item.alt || '',
      caption: item.caption || '',
      sort_order: index,
    }));

const slugifyFileName = (fileName = 'photo') => {
  const nameWithoutExtension = path.basename(fileName).replace(/\.[^/.]+$/, '');
  const slug = nameWithoutExtension
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);

  return slug || 'photo';
};

const getImagePayload = (body = {}) => {
  const dataUrl = String(body.dataUrl || body.data_url || '');
  const dataUrlMatch = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1],
      base64: dataUrlMatch[2],
    };
  }

  return {
    mimeType: String(body.mimeType || body.mime_type || ''),
    base64: String(body.base64 || body.data || ''),
  };
};

const uploadPhoto = async (req, res, next) => {
  try {
    const { mimeType, base64 } = getImagePayload(req.body);
    const extension = allowedImageTypes.get(mimeType);

    if (!extension) {
      throw createError('Format image non autorise.', 415);
    }

    const cleanBase64 = base64.replace(/\s/g, '');
    if (!cleanBase64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64)) {
      throw createError('Image invalide.', 422);
    }

    const buffer = Buffer.from(cleanBase64, 'base64');
    if (!buffer.length) {
      throw createError('Image vide.', 422);
    }

    if (buffer.length > maxImageSize) {
      throw createError('Image trop lourde.', 413);
    }

    await fs.mkdir(eventImagesDir, { recursive: true });

    const safeName = slugifyFileName(req.body?.fileName || req.body?.file_name);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safeName}.${extension}`;
    await fs.writeFile(path.join(eventImagesDir, filename), buffer);

    const imageUrl = `${req.protocol}://${req.get('host')}/images/events/${filename}`;
    res.status(201).json({
      success: true,
      message: 'Image ajoutee.',
      data: {
        image_url: imageUrl,
        filename,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getAll = async (_req, res, next) => {
  try {
    const rows = await Event.findAll({
      include: includeEventDetails,
      order: eventOrder,
    });

    res.json({ success: true, data: rows, total: rows.length });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const row = await Event.findByPk(req.params.id, {
      include: includeEventDetails,
      order: eventOrder,
    });
    if (!row) {
      throw createError('Actualite introuvable.', 404);
    }

    res.json({ success: true, data: row });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { program, photos, ...eventData } = req.body;
    const event = await Event.create(eventData);
    const normalizedProgram = normalizeProgram(program);
    const normalizedPhotos = normalizePhotos(photos);

    if (normalizedProgram.length) {
      await EventProgram.bulkCreate(
        normalizedProgram.map((item) => ({
          ...item,
          event_id: event.id,
        })),
      );
    }

    if (normalizedPhotos.length) {
      await EventPhoto.bulkCreate(
        normalizedPhotos.map((item) => ({
          ...item,
          event_id: event.id,
        })),
      );
    }

    const fullEvent = await Event.findByPk(event.id, {
      include: includeEventDetails,
      order: eventOrder,
    });
    res.status(201).json({ success: true, message: 'Actualite creee.', data: fullEvent });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { program, photos, ...eventData } = req.body;
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      throw createError('Actualite introuvable.', 404);
    }

    await event.update(eventData);

    if (program !== undefined) {
      await EventProgram.destroy({ where: { event_id: event.id } });

      const normalizedProgram = normalizeProgram(program);
      if (normalizedProgram.length) {
        await EventProgram.bulkCreate(
          normalizedProgram.map((item) => ({
            ...item,
            event_id: event.id,
          })),
        );
      }
    }

    if (photos !== undefined) {
      await EventPhoto.destroy({ where: { event_id: event.id } });

      const normalizedPhotos = normalizePhotos(photos);
      if (normalizedPhotos.length) {
        await EventPhoto.bulkCreate(
          normalizedPhotos.map((item) => ({
            ...item,
            event_id: event.id,
          })),
        );
      }
    }

    const fullEvent = await Event.findByPk(event.id, {
      include: includeEventDetails,
      order: eventOrder,
    });
    res.json({ success: true, message: 'Actualite mise a jour.', data: fullEvent });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const row = await Event.findByPk(req.params.id);
    if (!row) {
      throw createError('Actualite introuvable.', 404);
    }

    await EventProgram.destroy({ where: { event_id: row.id } });
    await EventPhoto.destroy({ where: { event_id: row.id } });
    await row.destroy();
    res.json({ success: true, message: 'Actualite supprimee.' });
  } catch (err) {
    next(err);
  }
};

const reorder = async (req, res, next) => {
  try {
    const { order } = req.body;
    await Promise.all(
      order.map(({ id, sort_order }) =>
        Event.update({ sort_order }, { where: { id } }),
      ),
    );

    res.json({ success: true, message: 'Ordre mis a jour.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove, reorder, uploadPhoto };
