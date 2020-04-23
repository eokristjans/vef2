const xss = require('xss');
const { query } = require('../utils/db');

const {
  isInt,
  isNotEmptyString,
  lengthValidationError,
} = require('../utils/validation');

/**
 * Helper function.
 * Returns the sections with the given ntoebookId. If userId is not null, 
 * then only returns the section if it has the given userId.
 * 
 * @param {number} notebookId of the notebook to which the section must belong. 
 * @param {number} userId of the user to whom the section must belong.
 */
async function readNotebookSections(notebookId, userId = null) {
  if (!isInt(notebookId)) {
    return null;
  }

  // If the userId is not an integer, then it will not be used in the request.
  const hasUser = userId && isInt(userId);
  const filterUser = hasUser ? 'AND user_id = $2' : '';

  const q = `
    SELECT
      *
    FROM
      sections
    WHERE
      notebook_id = $1
      ${filterUser}
  `;

  const result = await query(
    q,
    [notebookId, hasUser? userId : null].filter(Boolean),
  );

  const sections = result.rows;
  

  return sections;
}

/**
 * Helper function.
 * Returns the section with the given id. If userId is not null, 
 * then only returns the section if it has the given userId.
 * 
 * @param {number} id 
 * @param {number} userId of the user to whom the section must belong.
 */
async function readSection(id, userId = null) {
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
      sections
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

  const section = result.rows[0];
  
  // TODO: Section pages
  // section.pages = await readSectionPages(section.id);

  return section;
}


/** API */

/**
 * Return res.json with a section with id equal to req.params and
 * that req.user has access to.
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
async function readSectionRoute(req, res) {
  const { id } = req.params;
  const { user } = req;

  // Only admins can view all sections
  const userIdIfNotAdmin = user.admin ? null : user.id;

  const section = await readSection(id, userIdIfNotAdmin);

  if (!section) {
    return res.status(404).json({ error: 'Section not found.' })
  }

  return res.json(section);
}




/**
 * Return res.json with all notebooks that req.user has access to.
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
/* TODO: Uncomment and modify to sections if needed
async function readNotebooksRoute(req, res) {
  const { user } = req;

  console.log('readNotebooksRoute: ' + user.username);
  
  const filterUser = !user.admin ? 'WHERE user_id = $1' : '';

  const q = `
    SELECT
      *
    FROM
      notebooks
      ${filterUser}
  `;

  const result = await query(
    q,
    [!user.admin ? user.id : null].filter(Boolean),
  );

  
  console.log('readNotebooksRoute: ' + result);

  const notebooks = result.rows;
  
  // TODO: Notebook sections ??
  // notebook.sections = await readNotebookSections(notebook.id);

  return res.json({
    'results': notebooks,
  });
}
*/

module.exports = {
  readNotebookSections,
  readSectionRoute,
};
