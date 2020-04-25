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
 * Helper function.
 * Validates the title for an entity. Checks whether the title length
 * is correct, and checks if the user already has an entity with the same
 * title, and if either is true then returns an array with the field and error.
 *
 * @param {number} foreignKeyId userId for notebook, notebookId for section
 * and sectionId for page.
 * @param {string} title that needs to be validated.
 * @param {number} entityType Type of entity that is being validated.
 * 1 for notebook, 2 for section, 3 for page, 4 for image
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

  // Determine string literals
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
    case 4:
      entityName = 'image';
      foreignKeyIdName = 'user_id';
      foreignKeyEntityName = 'User';
      break;
    default:
      // Should not happen. TODO: Deal with?
      break;
  }

  // Create query
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

/**
 * Helper function.
 * Delete all pages in section with given sectionId,
 * belonging to user with given userId.
 *
 * @param {number} sectionId
 * @param {number} userId
 */
async function deleteSectionPages(sectionId, userId) {
  // Prepare query
  const q = `
    DELETE FROM 
      pages
    WHERE 
      section_id = $1 AND user_id = $2
  `;

  await query(q, [sectionId, userId]);
}


/**
 * Helper function.
 * Delete all sections in notebook with given notebookId,
 * and user_id matching the given userId.
 * Also deletes all the pages in the sections.
 *
 * @param {number} notebookId
 * @param {number} userId
 */
async function deleteNotebookSections(notebookId, userId) {
  // Prepare query to delete pages in the sections
  const q1 = `
    DELETE FROM 
      pages
    WHERE 
      user_id = $1
    AND
      notebook_id IN (
        SELECT id from notebooks where id = $2
      )
  `;

  await query(q1, [userId, notebookId]);

  // Prepare query to delete sections in the notebook
  const q2 = `
    DELETE FROM 
      sections
    WHERE 
      notebook_id = $1 AND user_id = $2
  `;

  await query(q2, [notebookId, userId]);
}


/**
 * Helper function.
 * Delete all entities with the given user_id from the specified table.
 *
 * @param {number} userId
 */
async function deleteUserContentsFromTable(userId, tableName) {
  const q = `
    DELETE FROM 
      ${tableName}
    WHERE 
      user_id = $1
  `;
  await query(q, [userId]);
}

/**
 * Helper function.
 * Delete all images, pages, sections and notebooks with a user_id
 * matching the given userId.
 *
 * @param {number} userId
 */
async function deleteUserContents(userId) {
  const tableNames = [
    'images',
    'pages',
    'sections',
    'notebooks',
  ];

  // Looping with await and foreign key restraints is an unnecessary hassle
  await deleteUserContentsFromTable(userId, tableNames[0]);
  await deleteUserContentsFromTable(userId, tableNames[1]);
  await deleteUserContentsFromTable(userId, tableNames[2]);
  await deleteUserContentsFromTable(userId, tableNames[3]);
}

module.exports = {
  validateTitleForEntity,
  readNotebookSections,
  readSectionPages,
  deleteSectionPages,
  deleteNotebookSections,
  deleteUserContents,
};
