/**
 * Contains routes for image_urls.
 */

const cloudinary = require('cloudinary').v2;
const xss = require('xss');

const { query, pagedQuery, conditionalUpdate } = require('../utils/db');
const addPageMetadata = require('../utils/addPageMetadata');
const debug = require('../utils/debug');

const {
  validateTitleForEntity,
} = require('./notebook-helpers');

const { // TODO: Delete unused imports
  isNotEmptyString,
  isEmpty,
  isString,
  isInt,
  lengthValidationError,
  toPositiveNumberOrDefault,
} = require('../utils/validation');

const {
  MIMETYPES,
  validateImageMimetype,
  withMulter,
} = require('../data/images');


/** HELPER FUNCTIONS */

/**
 * Creates and inserts a new Image entity for the current user with title from
 * req.body and file from req.file. Validates the input.
 * Returns an object representing the new entity if successful.
 * Uploads the file.
 *
 * @param {*} req contains .file and contains title in .body
 * @param {*} res
 * @param {*} next
 */
async function createImage(req, res, next) {
  const { title } = req.body;


  // file is empty if no image was uploaded
  const { user, file: { path, mimetype } = {} } = req;
  const hasImage = Boolean(path && mimetype);

  debug(req.body);
  debug(req.file);
  debug(req.multipart);

  if (!hasImage) {
    return res.status(400).json({ errors: [{
      field: 'url',
      error: 'Must upload an image',
    }] });
  }

  const validations = await validateTitleForEntity(user.id, title, 4);

  if (hasImage) {
    if (!validateImageMimetype(mimetype)) {
      validations.push({
        field: 'url',
        error: `Mimetype ${mimetype} is not legal. ` +
               `Only ${MIMETYPES.join(', ')} are accepted`,
      });
    }
  }

  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  let imageUrl;

  // Only valid images will be uploaded
  if (hasImage) {
    let upload = null;
    try {
      upload = await cloudinary.uploader.upload(path);
    } catch (error) {
      // If cloudinary returns an error, return that error
      if (error.http_code && error.http_code === 400) {
        return res.status(400).json({ errors: [{
          field: 'url',
          error: error.message,
        }] });
      }

      console.error('Unable to upload file to cloudinary');
      return next(error);
    }

    if (upload && upload.secure_url) {
      // Store the url to the image
      imageUrl = upload.secure_url;
    } else {
      // For some reason there is no secure_url?
      // TODO: Deal with that.
      return next(new Error('Cloudinary upload missing secure_url'));
    }
  }

  // Prepare query to insert image with url
  const q = `
    INSERT INTO
      images
      (user_id, title, url)
    VALUES
      ($1, $2, $3)
    RETURNING *
  `;

  const values = [
    user.id,
    xss(title),
    xss(imageUrl),
  ];

  const result = await query(q, values);

  return res.status(201).json(result.rows[0]);
}

/** API */

/**
 * Creates and inserts a new Image entity for the current user with title from
 * req.body and multipart file from req.file. Validates the input.
 * Uploads the multipart file.
 * Returns an object representing the new entity if successful.
 *
 * @param {*} req contains multipart file, and title in .body
 * @param {*} res
 * @param {*} next
 */
async function createImageRoute(req, res, next) {
  return withMulter(req, res, next, createImage);
}


module.exports = {
  createImageRoute,
};
