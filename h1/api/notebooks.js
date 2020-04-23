const xss = require('xss');
const { query } = require('../utils/db');

const {
  readNotebookSections,
} = require('./sections');

const {
  isInt,
  isNotEmptyString,
  lengthValidationError,
} = require('../utils/validation');

/** Helper functions */

/**
 * Helper function.
 * Returns the Notebook with the given id. If userId is not null, 
 * then only returns the notebook if it has the given userId.
 * Notebooks sections are nested within.
 * 
 * @param {number} id 
 * @param {number} userId of the user to whom the notebook must belong.
 */
async function readNotebook(id, userId = null) {
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
      notebooks
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

  const notebook = result.rows[0];
  
  notebook.sections = await readNotebookSections(notebook.id);

  return notebook;
}


/** API */

/**
 * Return res.json with the Notebook with id equal to req.params and
 * that req.user has access to. Notebooks sections are nested within.
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
async function readNotebookRoute(req, res) {
  const { id } = req.params;
  const { user } = req;

  // Only admins can view all notebooks
  const userIdIfNotAdmin = user.admin ? null : user.id;

  const notebook = await readNotebook(id, userIdIfNotAdmin);

  if (!notebook) {
    // TODO: Return 403 forbidden if notebook exists but not admin?
    return res.status(404).json({ error: 'Notebook not found.' })
  }

  return res.json(notebook);
}




/**
 * Return res.json with all notebooks that req.user has access to.
 * 
 * @param {Object} req 
 * @param {Object} res 
 */
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
  
  return res.json({
    'results': notebooks,
  });
}

module.exports = {
  readNotebookRoute,
  readNotebooksRoute
};
