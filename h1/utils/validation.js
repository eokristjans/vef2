// Helper functions for validating input, data types and such.
const { query } = require('./db');
const xss = require('xss');

function isEmpty(s) {
  return s != null && !s;
}

function isInt(i) {
  return i !== '' && Number.isInteger(Number(i));
}

function isString(s) {
  return typeof s === 'string';
}

function isBoolean(b) {
  return typeof b === 'boolean';
}

/**
 * Creates a validation error for string s
 * 
 * @param {string} s to create validation error for
 * @param {number} min the minimum allowed length for s
 * @param {number} max the minimum allowed length for s
 */
function lengthValidationError(s, min, max) {
  const length = s && s.length ? s.length : 'undefined';

  const minMsg = min ? `at least ${min} characters` : '';
  const maxMsg = max ? `at most ${max} characters` : '';
  const msg = [minMsg, maxMsg].filter(Boolean).join(', ');
  const lenMsg = `Current length is ${length}.`;

  return `Must be non empty string ${msg}. ${lenMsg}`;
}

function isNotEmptyString(s, { min = undefined, max = undefined } = {}) {
  if (typeof s !== 'string' || s.length === 0) {
    return false;
  }

  if (max && s.length > max) {
    return false;
  }

  if (min && s.length < min) {
    return false;
  }

  return true;
}

function toPositiveNumberOrDefault(value, defaultValue) {
  const cast = Number(value);
  const clean = Number.isInteger(cast) && cast > 0 ? cast : defaultValue;

  return clean;
}



/**
 * Validates the title for an entity. Checks whether the title length
 * is correct, and checks if the user already has an entity with the same
 * title, and if either is true then returns an error for the title field. 
 * 
 * @param {number} foreignKeyId userId for notebook, notebookId for section and sectionId for page.
 * @param {string} title 
 * @param {string} entityName Singular form of a table name.
 */
async function validateTitleForEntity(foreignKeyId, title, entityName) {

  // Validate length
  if (!isNotEmptyString(title, { min: 1, max: 256 })) {
    return [{
      field: 'title',
      error: lengthValidationError(title, 1, 256),
    }];
  }

  let foreignKeyIdName = '';
  switch(entityName) {
    case 'notebook':
      foreignKeyIdName = 'user_id';
      break;
    case 'section':
      foreignKeyIdName = 'notebook_id';
      break;
    case 'page':
      foreignKeyIdName = 'section_id';
      break;
    case 'default':
      // Should not happen. TODO: Deal with?
      break;
  }

  const xssTitle = xss(title);

  // Check if user has another entity with same title
  const entity = await query(
    `SELECT id FROM ${entityName}s WHERE ${foreignKeyIdName} = $1 AND title = $2`,
    [foreignKeyId, title],
  );

  if (entity.rows.length > 0) {
    const error = `User already has a ${entityName} with title '${title}'.`;
    return [{ field: 'title', error}];
  }

  // No validation error
  return [];
}

module.exports = {
  isEmpty,
  isString,
  isBoolean,
  isInt,
  isNotEmptyString,
  toPositiveNumberOrDefault,
  lengthValidationError,
  validateTitleForEntity,
};