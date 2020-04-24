const xss = require('xss');
const { query } = require('../utils/db');

const {
  validateTitleForEntity,
} = require('./notebook-helpers');

const {
  readSection,
} = require('./sections');

const {
  isInt,
  isNotEmptyString,
} = require('../utils/validation');

/** HELPER FUNCTIONS */

/**
 * Helper function.
 * Returns the page with the given id. If userId is not null,
 * then only returns the page if it has the given userId.
 * The page body is nested within.
 *
 * @param {number} id
 * @param {number} userId of the user to whom the page must belong.
 */
async function readPage(id, userId = null) {
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
      pages
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

  const page = result.rows[0];

  return page;
}


/** API */

/**
 * Return res.json with a page with id equal to req.params and
 * that req.user has access to. The page body is nested within.
 *
 * @param {Object} req
 * @param {Object} res
 */
async function readPageRoute(req, res) {
  const { id } = req.params;
  const { user } = req;

  // Only admins can view all pages
  const userIdIfNotAdmin = user.admin ? null : user.id;

  const page = await readPage(id, userIdIfNotAdmin);

  if (!page) {
    return res.status(404).json({ error: 'Page not found.' });
  }

  return res.json(page);
}

/**
 * Creates and inserts a new Page entity with title and sectionId
 * from req.body for the current user. Validates the input.
 * Returns an object representing the new entity if successful.
 *
 * @param {Object} req must contain .user and .body.title.
 * @param {Object} res
 */
async function createPageRoute(req, res) {
  const { user } = req;
  const { title, sectionId } = req.body;

  // Check that the notebook belongs to the current user
  const section = await readSection(sectionId, user.id);

  if (!section) {
    return res.status(404).json({ error: 'Section not found.' });
  }
  const notebookId = section.notebook_id;

  // Validate input
  const entityName = 'page';
  const validations = await validateTitleForEntity(
    sectionId, title, 3,
  );

  // Return validation error if any
  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  // Prepare query
  const q = `
    INSERT INTO 
      ${entityName}s
        (user_id, notebook_id, section_id, title, body)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *
  `;

  const result = await query(
    q,
    [user.id, notebookId, sectionId, xss(title), ''],
  );

  return res.status(201).json(result.rows[0]);
}


/**
 * Updates a Page entity with title and body from req.body and
 * id from req.params for the current user. Validates the input.
 * Returns an object representing the new entity if successful.
 *
 * @param {Object} req containing page id in .params and
 * new body and title in .body
 * @param {Object} res
 */
async function updatePageRoute(req, res) {
  const { user } = req;
  const { id } = req.params;
  const { title, body } = req.body;

  // Check that the page belongs to user
  let page = await readPage(id, user.id);

  if (!page) {
    return res.status(404).json({ error: 'Page not found.' });
  }

  // Check if title is being updated
  const hasTitle = title && isNotEmptyString(title, { min: 1, max: 256 });
  const setTitle = hasTitle ? 'title = $2,' : '';

  // If updating title, check that it's valid
  if (hasTitle && xss(title) !== page.title) {
    // Validate title
    const validations = await validateTitleForEntity(
      page.section_id, title, 3,
    );

    // Return validation error if any
    if (validations.length > 0) {
      return res.status(400).json({
        errors: validations,
      });
    }
  }

  const entityName = 'page';

  // Prepare query (both title and body can be updated)
  const q = `
    UPDATE
      ${entityName}s
    SET body = $1, ${setTitle} updated = current_timestamp
    WHERE id = $3
      RETURNING *
  `;

  const result = await query(
    q,
    [
      xss(body),
      hasTitle ? xss(title) : '',
      id,
    ],
  );
  page = result.rows[0]; // eslint-disable-line prefer-destructuring

  return res.status(200).json(page);
}


module.exports = {
  readPageRoute,
  createPageRoute,
  updatePageRoute,
};
