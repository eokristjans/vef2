/**
 * Contains routes for image_urls.
 */

const cloudinary = require('cloudinary').v2;
const xss = require('xss');

const { query, pagedQuery } = require('../utils/db');
const addPageMetadata = require('../utils/addPageMetadata');

const {
  validateTitleForEntity,
} = require('./notebook-helpers');

const { // TODO: Delete unused imports
  isInt,
  toPositiveNumberOrDefault,
} = require('../utils/validation');

const {
  MIMETYPES,
  validateImageMimetype,
  withMulter,
} = require('../data/images');


/** HELPER FUNCTIONS */

/**
 * Helper function.
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


/**
 * Helper function.
 * Returns multiple images. If userId is not null, then only returns
 * the Image if it has the given userId.
 *
 * @param {number} offset specifies how many of the first images
 *                        should be skipped
 * @param {number} limit  specifies the maximum number of images
 *                        that should be returned
 * @param {number} userId of the user to whom the images must belong.
 */
async function readImages(offset = 0, limit = 10, userId = null) {
  // If the userId is not an integer, then it will not be used in the request.
  const hasUser = userId && isInt(userId);
  const filterUser = hasUser ? 'WHERE user_id = $1' : '';

  // Prepare paged query
  const q = `
    SELECT * FROM 
      images
    ${filterUser}
    ORDER BY created DESC
  `;
  const qValues = userId ? [userId] : [];

  // Execute query
  const images = await pagedQuery(
    q,
    qValues,
    { offset, limit },
  );

  return images;
}


/**
 * Helper function.
 * Returns the Image with the given id. If userId is not null,
 * then only returns the Image if it has the given userId.
 * Images sections are nested within.
 *
 * @param {number} id of the Image
 * @param {number} userId of the user to whom the Image must belong.
 */
async function readImage(id, userId = null) {
  if (!isInt(id)) {
    return null;
  }

  // If the userId is not an integer, then it will not be used in the request.
  const hasUser = userId && isInt(userId);
  const filterUser = hasUser ? 'AND user_id = $2' : '';

  const q = `
    SELECT
      *
    FROM
      images
    WHERE
      id = $1
      ${filterUser}
  `;

  const result = await query(
    q,
    [
      id,
      hasUser ? userId : null,
    ].filter(Boolean),
  );

  if (result.rows.length !== 1) {
    return null;
  }

  const image = result.rows[0];

  return image;
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
async function readImageRoute(req, res) {
  const { user } = req;
  const { id } = req.params;

  // Only admins can view all images
  const userIdIfNotAdmin = user.admin ? null : user.id;

  const image = await readImage(id, userIdIfNotAdmin);

  if (!image) {
    return res.status(404).json({ error: 'Image not found.' });
  }

  return res.json(image);
}


/**
 * Returns a paged JSON object with up to 10 Images.
 *
 * @param {Object} req may contain .query with offset and limit
 * @param {Object} res
 */
async function readImagesRoute(req, res) {
  const { user } = req;
  let { offset = 0, limit = 10 } = req.query;

  // Only admins can view all images
  const userIdIfNotAdmin = user.admin ? null : user.id;

  // Sanitize input
  offset = toPositiveNumberOrDefault(offset, 0);
  limit = toPositiveNumberOrDefault(limit, 10);

  const images = await readImages(offset, limit, userIdIfNotAdmin);

  // Add page metadata
  const imagesWithPage = addPageMetadata(
    images,
    req.path,
    { offset, limit, length: images.items.length },
  );

  return res.json(imagesWithPage);
}

/**
 * Delets the Image entity with the given id if it belongs to the user.
 * Returns 204 no content if successful.
 *
 * @param {*} req contains multipart file, and title in .body
 * @param {*} res
 * @param {*} next
 */
async function deleteImageRoute(req, res) {
  const { user } = req;
  const { id } = req.params;

  // Check that the Image belongs to the current user
  const image = await readImage(id, user.id);

  if (!image) {
    return res.status(404).json({ error: 'Image not found.' });
  }

  // Prepare and execute query
  const q = 'DELETE FROM images WHERE id = $1';
  await query(q, [id]);

  return res.status(204).json({});
}


module.exports = {
  createImageRoute,
  readImageRoute,
  readImagesRoute,
  deleteImageRoute,
};
