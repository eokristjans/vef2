/* 
Contains functions that can't be placed elsewhere due to circular imports
(e.g. notebook imports from section and section from notebook)
*/
const { query } = require('../utils/db');

const {
  isInt,
  isNotEmptyString,
  lengthValidationError,
  validateTitleForEntity,
} = require('../utils/validation');

/** HELPER FUNCTIONS */

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
    [notebookId, hasUser? userId : null].filter(Boolean),
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
    [sectionId, hasUser? userId : null].filter(Boolean),
  );

  const pages = result.rows;
  

  return pages;
}

module.exports = {
  readNotebookSections,
  readSectionPages,
}
