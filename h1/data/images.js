// A beaute learned from Olafur Sverrir Kjartansson

const util = require('util');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

const debug = require('../utils/debug');

const readDirAsync = util.promisify(fs.readdir);
const statAsync = util.promisify(fs.stat);
const resourcesAsync = util.promisify(cloudinary.api.resources);
const uploadAsync = util.promisify(cloudinary.uploader.upload);

// Permitted mimetypes
const MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
];

// Geymum í minni niðurstöður úr því að lista allar myndir frá Cloudinary
let cachedListImages = null;

async function listImages() {
  if (cachedListImages) {
    return Promise.resolve(cachedListImages);
  }

  // TODO hér þyrfti að taka við pageuðum niðurstöðum frá Cloudinary
  // en þar sem við erum með 20 myndir fáum við hámark per request og látum duga
  const res = await resourcesAsync({ max_results: 100 });

  cachedListImages = res.resources;

  return res.resources;
}

function imageComparer(current) {
  // TODO hér ættum við að bera saman fleiri hluti, t.d. width og height
  return uploaded => uploaded.bytes === current.size;
}

async function getImageIfUploaded(imagePath) {
  const uploaded = await listImages();

  const stat = await statAsync(imagePath);

  const current = { size: stat.size };

  const found = uploaded.find(imageComparer(current));

  return found;
}

async function uploadImageIfNotUploaded(imagePath) {
  const alreadyUploaded = await getImageIfUploaded(imagePath);

  if (alreadyUploaded) {
    debug(`Mynd ${imagePath} þegar uploadað`);
    return alreadyUploaded.secure_url;
  }

  const uploaded = await uploadAsync(imagePath);
  debug(`Mynd ${imagePath} uploadað`);

  return uploaded.secure_url;
}

async function uploadImagesFromDisk(imageDir) {
  const imagesFromDisk = await readDirAsync(imageDir);

  const filteredImages = imagesFromDisk
    .filter(i => path.extname(i).toLowerCase() === '.jpg');

  debug(`Bæti við ${filteredImages.length} myndum`);

  const images = [];

  for (let i = 0; i < filteredImages.length; i++) {
    const image = filteredImages[i];
    const imagePath = path.join(imageDir, image);
    const uploaded = await uploadImageIfNotUploaded(imagePath); // eslint-disable-line

    images.push(uploaded);
  }

  debug('Búið að senda myndir á Cloudinary');

  return images;
}

/**
 * Returns true if mimetype is permitted in the system.
 *
 * @param {string} mimetype
 */
function validateImageMimetype(mimetype) {
  return MIMETYPES.indexOf(mimetype.toLowerCase()) >= 0;
}

async function withMulter(req, res, next, fn) {
  multer({ dest: './temp' })
    .single('url')(req, res, (err) => {
      if (err) {
        if (err.message === 'Unexpected field') {
          const errors = [{
            field: 'url',
            error: 'Unable to read image',
          }];
          return res.status(400).json({ errors });
        }

        return next(err);
      }

      return fn(req, res, next).catch(next);
    });
}

module.exports = {
  uploadImagesFromDisk,
  validateImageMimetype,
  withMulter,
};
