/*
Contains functions that can't be placed elsewhere due to circular imports
(e.g. notebook imports from section and section from notebook)
*/
const xss = require('xss');
const { query } = require('../utils/db');

const {
  isInt,
  isNotEmptyString,
  lengthValidationError,
} = require('../utils/validation');

/** HELPER FUNCTIONS */

/**
 * Validates the title for an entity. Checks whether the title length
 * is correct, and checks if the user already has an entity with the same
 * title, and if either is true then returns an error for the title field.
 *
 * @param {number} foreignKeyId userId for notebook, notebookId for section
 * and sectionId for page.
 * @param {string} title that needs to be validated.
 * @param {number} entityType Type of entity that is being validated.
 * 1 for notebook, 2 for section, 3 for page.
 */
async function validateTitleForEntity(foreignKeyId, title, entityType) {
  // Validate length
  if (!isNotEmptyString(title, { min: 1, max: 256 })) {
    return [{
      field: 'title',
      error: lengthValidationError(title, 1, 256),
    }];
  }

  const xssTitle = xss(title);

  let {
    foreignKeyIdName = '',
    entityName = '',
    foreignKeyEntityName = '',
  } = { };
  switch (entityType) {
    case 1:
      entityName = 'notebook';
      foreignKeyIdName = 'user_id';
      foreignKeyEntityName = 'User';
      break;
    case 2:
      entityName = 'section';
      foreignKeyIdName = 'notebook_id';
      foreignKeyEntityName = 'Notebook';
      break;
    case 3:
      entityName = 'page';
      foreignKeyIdName = 'section_id';
      foreignKeyEntityName = 'Section';
      break;
    default:
      // Should not happen. TODO: Deal with?
      break;
  }

  const q = `
  SELECT 
    id 
  FROM 
    ${entityName}s 
  WHERE
    ${foreignKeyIdName} = $1 
  AND
    title = $2
  `;

  // Check if user has another entity with same title
  const entity = await query(
    q,
    [foreignKeyId, xssTitle],
  );

  if (entity.rows.length > 0) {
    // eslint-disable-next-line max-len
    const error = `${foreignKeyEntityName} already has a ${entityName} with title '${xssTitle}'.`;
    return [{ field: 'title', error }];
  }

  // No validation error
  return [];
}

/**
 * Helper function.
 * Returns the sections with the given notebookId. If userId is not null,
 * then only returns the sections if they have the given userId.
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
    [
      notebookId,
      hasUser ? userId : null,
    ].filter(Boolean),
  );

  const sections = result.rows;

  return sections;
}


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
    [
      sectionId,
      hasUser ? userId : null,
    ].filter(Boolean),
  );

  const pages = result.rows;

  return pages;
}

module.exports = {
  validateTitleForEntity,
  readNotebookSections,
  readSectionPages,
};
