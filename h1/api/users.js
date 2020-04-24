// TODO: remove unnecessary pagedQueries? Naa it's aiiight
// TODO: Documentation
// TODO: rename listUser and listUsers to select or read?

// import modules for user authentication.
const {
  validateUser,
  updateUser,
  findById,
} = require('../auth/users');

const { deleteUserContents } = require('./notebook-helpers');

const { query, pagedQuery } = require('../utils/db');
const { isBoolean } = require('../utils/validation');
const addPageMetadata = require('../utils/addPageMetadata');

/**
 * Returns a paged JSON object with up to 10 users.
 *
 * @param {Object} req may contain .query with page offset and limit
 * @param {Object} res
 */
async function readUsersRoute(req, res) {
  const { offset = 0, limit = 10 } = req.query;

  const users = await pagedQuery(
    `SELECT
      id, username, email, admin, created, updated
    FROM
      users
    ORDER BY updated DESC`,
    [],
    { offset, limit },
  );

  const usersWithPage = addPageMetadata(
    users,
    req.path,
    { offset, limit, length: users.items.length },
  );

  return res.json(usersWithPage);
}


/**
 * Returns a JSON object representing a user with id from req.params.
 *
 * @param {Object} req must contain user id in .params
 * @param {Object} res
 */
async function readUserRoute(req, res) {
  const { id } = req.params;

  // Find the user and return it if found
  const user = await findById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json(user);
}


/**
 * Deletes the user with id from req.params.
 * Also deletes the user's notebooks, sections and pages.
 * Returns 304 no conent if successful.
 *
 * @param {Object} req must contain user id in .params
 * @param {Object} res
 */
async function deleteUserRoute(req, res) {
  const { id } = req.params;

  // Find the user
  const user = await findById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.admin) {
    return res.status(403).json({ error: 'Can not delete an admin' });
  }

  // Delete sections in this notebook
  await deleteUserContents(id);

  // Delete notebook
  const entityName = 'user';
  const q = `DELETE FROM ${entityName}s WHERE id = $1`;

  await query(q, [id]);

  return res.status(204).json({});
}


/**
 * Updates the user with id from req.params, changing
 * the user's admin field to be that from req.body.
 *
 * @param {Object} req must contain user id in .params
 * @param {Object} res
 */
async function updateUserRoute(req, res) {
  const { id } = req.params;
  const { user: currentUser } = req;
  const { admin } = req.body;

  // Find the user being updated
  const user = await findById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Validate admin input
  if (!isBoolean(admin)) {
    return res.status(400).json({
      errors: [{
        field: 'admin',
        error: 'Must be a boolean',
      }],
    });
  }

  // Check if user is an admin trying to revoke his own admin privileges
  if (!admin && (currentUser.id === Number(id))) {
    return res.status(400).json({
      error: 'Can not remove admin privileges from self',
    });
  }

  // Prepare query to update user
  const q = `
    UPDATE
      users
    SET admin = $1, updated = current_timestamp
    WHERE id = $2
    RETURNING
      id, username, email, admin, created, updated`;
  const result = await query(q, [Boolean(admin), id]);

  return res.status(201).json(result.rows[0]);
}

/**
 * Returns a JSON object representing the user that is stored in req.user.
 *
 * @param {Object} req must contain .user
 * @param {Object} res
 */
async function currentUserRoute(req, res) {
  const { user: { id } = {} } = req;

  // Find the current user and return entity if found
  const user = await findById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json(user);
}


/**
 * Updates the user that is stored in req.user, changing the
 * values of the fields given in req.body.
 *
 * @param {Object} req must contain .user and may contain .body
 * which may contain password or email to be updated.
 * @param {Object} res
 */
async function updateCurrentUser(req, res) {
  const { id } = req.user;

  // Find the current user
  const user = await findById(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get the password and email
  const { password, email } = req.body;

  // Validate the input
  const validationMessage = await validateUser({ password, email }, true, id);

  if (validationMessage.length > 0) {
    return res.status(400).json({ errors: validationMessage });
  }

  // Update user
  const result = await updateUser(id, password, email);

  if (!result) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  return res.status(200).json(result);
}

module.exports = {
  readUsersRoute,
  readUserRoute,
  updateUser: updateUserRoute,
  currentUser: currentUserRoute,
  updateCurrentUser,
  deleteUserRoute,
};
