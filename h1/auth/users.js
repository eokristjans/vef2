const bcrypt = require('bcryptjs');
const xss = require('xss');

// import 500 worst passwords
const worstPasswords = require('./500-worst-passwords');

// import validation utils
const {
  isInt,
  isEmpty,
  isNotEmptyString,
  isString,
  toPositiveNumberOrDefault,
  lengthValidationError,
} = require('../utils/validation');

// import database utils
const { query, conditionalUpdate } = require('../utils/db');

const {
  BCRYPT_ROUNDS: bcryptRounds = 17,
} = process.env;


/**
 * Compares the password to the hash
 *
 * @param {string} password
 * @param {string} hash
 * @returns {boolean} true if the password matches the hash
 */
async function comparePasswords(password, hash) {
  // TODO: Look into using different salts for each user

  // eslint-disable-next-line no-return-await
  return await bcrypt.compare(password, hash);
}


/**
 * Find and returns a user entity using the given username.
 * @param {string} username
 */
async function findByUsername(username) {
  const q = `
    SELECT
      id, username, password, email, admin
    FROM
      users
    WHERE username = $1`;

  const result = await query(q, [username]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}


/**
 * Find and returns a user entity using the given email.
 * @param {string} email
 */
async function findByEmail(email) {
  const q = `
    SELECT
      id, username, password, email, admin
    FROM
      users
    WHERE email = $1`;

  const result = await query(q, [email]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}


/**
 * Find and returns a user entity using the given id.
 * @param {number} id
 */
async function findById(id) {
  if (!isInt(id)) {
    return null;
  }

  const user = await query(
    `SELECT
      id, username, email, admin, created, updated
    FROM
      users
    WHERE id = $1`,
    [id],
  );

  if (user.rows.length !== 1) {
    return null;
  }

  return user.rows[0];
}


/**
 * Validate input for inserting or updating (patching) a user
 *
 * @param {object} param0 { username, password, email }
 * @param {boolean} patching whether user is being patched or not (inserted)
 * @param {number} id user id
 */
async function validateUser(
  { username, password, email } = {},
  patching = false,
  id = null,
) {
  const validations = [];

  // patching a username is not allowed
  if (!patching) {
    if (!isNotEmptyString(username, { min: 3, max: 32 })) {
      validations.push({
        field: 'username',
        error: lengthValidationError(username, 3, 32),
      });
    }

    const user = await findByUsername(username);

    if (user) {
      validations.push({
        field: 'username',
        error: 'Username exists',
      });
    }
  }

  if (!patching || password || isEmpty(password)) {
    if (worstPasswords.indexOf(password) >= 0) {
      validations.push({
        field: 'password',
        error: 'Password is too bad',
      });
    }

    if (!isNotEmptyString(password, { min: 8 })) {
      validations.push({
        field: 'password',
        error: lengthValidationError(password, 8),
      });
    }
  }

  if (!patching || email || isEmpty(email)) {
    if (!isNotEmptyString(email, { min: 1, max: 64 })) {
      validations.push({
        field: 'email',
        error: lengthValidationError(1, 64),
      });
    }

    const user = await findByEmail(email);

    if (user) {
      const current = user.id;

      if (patching && id && current === toPositiveNumberOrDefault(id, 0)) {
        // we can patch our own email
      } else {
        validations.push({
          field: 'email',
          error: 'Email exists',
        });
      }
    }
  }

  return validations;
}


const { createUserContents } = require('./../api/notebook-helpers');

/**
 * Helper function.
 * Creates and inserts a user with given parameters.
 * Hashes the password and applies xss to input, but no validation.
 *
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {boolean} admin
 */
async function createUser(username, password, email, admin = false) {
  const hashedPassword = await bcrypt.hash(password, bcryptRounds);

  const q = `
    INSERT INTO
      users (username, email, password, admin)
    VALUES
      ($1, $2, $3, $4)
    RETURNING *`;

  const values = [xss(username), xss(email), hashedPassword, admin];
  const result = await query(
    q,
    values,
  );

  const createdUser = result.rows[0];
  delete createdUser.password;

  await createUserContents(createdUser.id);

  return createdUser;
}


/**
 * Helper function.
 * Updates an existing user with given parameters.
 * Hashes the password and applies xss to input, but no validation.
 *
 * @param {number} id
 * @param {string} password
 * @param {string} email
 */
async function updateUser(id, password, email) {
  if (!isInt(id)) {
    return null;
  }

  const fields = [
    isString(password) ? 'password' : null,
    isString(email) ? 'email' : null,
  ];

  let hashedPassword = null;

  if (password) {
    hashedPassword = await bcrypt.hash(password, bcryptRounds);
  }

  const values = [
    hashedPassword,
    isString(email) ? xss(email) : null,
  ];

  fields.push('updated');
  values.push(new Date());

  const result = await conditionalUpdate('users', id, fields, values);

  if (!result) {
    return null;
  }

  const updatedUser = result.rows[0];
  delete updatedUser.password;

  return updatedUser;
}


module.exports = {
  validateUser,
  comparePasswords,
  findByUsername,
  findById,
  createUser,
  updateUser,
};
