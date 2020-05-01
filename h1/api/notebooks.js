const xss = require('xss');
const { query } = require('../utils/db');

const {
  validateTitleForEntity,
  readNotebookSections,
  deleteNotebookSections,
  readSectionPages,
} = require('./notebook-helpers');

const {
  isInt,
} = require('../utils/validation');


/** HELPER FUNCTIONS */

/**
 * Helper function.
 * Returns the Notebook with the given id. If userId is not null,
 * then only returns the notebook if it has the given userId.
 * Notebooks sections are nested within.
 *
 * @param {number} id of the notebook
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
    [
      id,
      hasUser ? userId : null,
    ].filter(Boolean),
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
    return res.status(404).json({ error: 'Notebook not found.' });
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

  // Only admins can access all notebooks
  const filterUser = !user.admin ? 'WHERE user_id = $1' : '';

  // Prepare query
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

  const notebooks = result.rows;

  return res.json({
    results: notebooks,
  });
}


/**
 * Return res.json with all notebooks that req.user has access to.
 *
 * @param {Object} req
 * @param {Object} res
 */
async function readNotebooksWithSectionsWithPagesRoute(req, res) {
  const { user } = req;

  // Only admins can access all notebooks
  const filterUser = !user.admin ? 'WHERE user_id = $1' : '';

  // Prepare query
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

  const notebooks = result.rows;

  for (let i = 0; i < notebooks.length; i++) {
    notebooks[i].sections = await readNotebookSections(notebooks[i].id, user.id);

    for (let j = 0; j < notebooks[i].sections.length; j++) {
      notebooks[i].sections[j].pages = readSectionPages(notebooks[i].sections[j].id, user.id)
    }
  }
  
  return res.json({
    results: notebooks,
  });
}

/**
 * Creates and inserts a new Notebook entity with title from
 * req.body for the current user. Validates the input.
 * Returns an object representing the new entity if successful.
 *
 * @param {Object} req must contain .user and .body.title
 * @param {Object} res
 */
async function createNotebookRoute(req, res) {
  const { user } = req;
  const { title } = req.body;

  // Validate input
  const validations = await validateTitleForEntity(user.id, title, 1);

  // Return validation error if any
  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  // Prepare query
  const q = `
    INSERT INTO 
      notebooks
        (user_id, title)
      VALUES
        ($1, $2)
      RETURNING *
  `;

  const result = await query(q, [user.id, xss(title)]);

  // TODO: Insert default empty section or add empty array?

  return res.status(201).json(result.rows[0]);
}


/**
 * Updates a Notebook entity with title from req.body and
 * id from req.params for the current user. Validates the input.
 * Returns an object representing the new entity if successful.
 *
 * @param {Object} req containing notebook id in .params and new title in .body
 * @param {Object} res
 */
async function updateNotebookRoute(req, res) {
  const { user } = req;
  const { id } = req.params;
  const { title } = req.body;

  // Check that the notebook belongs to user
  let notebook = await readNotebook(id, user.id);

  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found.' });
  }

  // Validate input
  const validations = await validateTitleForEntity(user.id, title, 1);

  // Return validation error if any
  if (validations.length > 0) {
    return res.status(400).json({
      errors: validations,
    });
  }

  // Prepare query (only title can be updated)
  const q = `
    UPDATE notebooks
    SET title = $1, updated = current_timestamp
    WHERE id = $2
      RETURNING *
  `;

  const result = await query(q, [xss(title), notebook.id]);
  notebook = result.rows[0]; // eslint-disable-line prefer-destructuring

  notebook.sections = await readNotebookSections(notebook.id, user.id);

  return res.status(200).json(notebook);
}

/**
 * Deletes a Notebook entity.
 * Returns status 204 no content if successful.
 *
 * @param {Object} req with notebook id in .params
 * @param {Object} res
 */
async function deleteNotebookRoute(req, res) {
  const { user } = req;
  const { id } = req.params;

  // Check that the page belongs to the current user
  const notebook = await readNotebook(id, user.id);

  if (!notebook) {
    return res.status(404).json({ error: 'Notebook not found.' });
  }

  // Delete sections in this notebook
  await deleteNotebookSections(id, user.id);

  // Delete notebook
  const entityName = 'notebook';
  const q = `DELETE FROM ${entityName}s WHERE id = $1`;

  await query(q, [id]);

  return res.status(204).json({});
}

module.exports = {
  readNotebook,
  readNotebookRoute,
  readNotebooksRoute,
  readNotebooksWithSectionsWithPagesRoute,
  createNotebookRoute,
  updateNotebookRoute,
  deleteNotebookRoute,
};
