const xss = require('xss');
const { query } = require('../utils/db');


const {
  isInt,
  isNotEmptyString,
  lengthValidationError,
} = require('../utils/validation');

/** HELPER FUNCTIONS */

/**
 * Helper function.
 * Returns the pages with the given sectionId. If userId is not null, 
 * then only returns the pages if they have the given userId.
 * The page body is NOT nested within.
 * 
 * @param {number} sectionId of the section to which the pages must belong. 
 * @param {number} userId of the user to whom the pages must belong.
 */
async function readSectionPages(sectionId, userId = null) {
  if (!isInt(sectionId)) {
    return null;
  }

  // If the userId is not an integer, then it will not be used in the request.
  const hasUser = userId && isInt(userId);
  const filterUser = hasUser ? 'AND user_id = $2' : '';

  // Select * EXCEPT the body
  const q = `
    SELECT
      id, title, created, updated, user_id, notebook_id, section_id
    FROM
      pages
    WHERE
      section_id = $1
      ${filterUser}
  `;

  const result = await query(
    q,
    [sectionId, hasUser? userId : null].filter(Boolean),
  );

  const pages = result.rows;
  

  return pages;
}

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
    [id, hasUser? userId : null].filter(Boolean),
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
    return res.status(404).json({ error: 'Page not found.' })
  }

  return res.json(page);
}

module.exports = {
  readSectionPages,
  readPageRoute,
};
