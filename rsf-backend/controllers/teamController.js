// controllers/teamController.js
const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { TeamMember } = require('../models');
const { createError } = require('../middleware/errorHandler');

const teamImagesDir = path.join(__dirname, '..', 'public', 'images', 'team');
const allowedImageTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);
const maxImageSize = 8 * 1024 * 1024;

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

    await fs.mkdir(teamImagesDir, { recursive: true });

    const safeName = slugifyFileName(req.body?.fileName || req.body?.file_name);
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}-${safeName}.${extension}`;
    await fs.writeFile(path.join(teamImagesDir, filename), buffer);

    const imageUrl = `${req.protocol}://${req.get('host')}/images/team/${filename}`;
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

const getAll = async (req, res, next) => {
  try {
    const members = await TeamMember.findAll({
      order: [
        ['is_president', 'DESC'],
        ['sort_order', 'ASC'],
      ],
    });
    res.json({ success: true, data: members });
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);
    if (!member) {
      throw createError('Membre introuvable.', 404);
    }
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const member = await TeamMember.create(req.body);
    res.status(201).json({ success: true, message: 'Membre ajoute.', data: member });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);
    if (!member) {
      throw createError('Membre introuvable.', 404);
    }
    await member.update(req.body);
    res.json({ success: true, message: 'Membre mis a jour.', data: member });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const member = await TeamMember.findByPk(req.params.id);
    if (!member) {
      throw createError('Membre introuvable.', 404);
    }
    await member.destroy();
    res.json({ success: true, message: 'Membre supprime.' });
  } catch (err) {
    next(err);
  }
};

const reorder = async (req, res, next) => {
  try {
    const { order = [] } = req.body;
    await Promise.all(
      order.map(({ id, sort_order }) =>
        TeamMember.update({ sort_order }, { where: { id } }),
      ),
    );
    res.json({ success: true, message: 'Ordre mis a jour.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove, reorder, uploadPhoto };
