/* Útfæra skal virkni í todos.js, öll föll skjal skjala með jsdoc. */

/* VIRKNI:
- Sækja öll verkefni með id, title, position, due, created, updated, completed
  - Mögulegt skal vera að senda inn röðunargildi sem stýrir því hvort lista
    sé raðað eftir position í hækkandi (ascending) eða lækkandi röð (descending)
  - Mögulegt skal vera að senda inn að aðeins eigi að sýna verkefni sem er lokið (completed = true)

- Sækja stakt verkefni eftir id með id, title, position, due, created, updated, completed

- Eyða verkefni eftir id

TODO:
- Útbúa verkefni með titli, loka dagsetningu og staðsetningu
  - Verkefni sem er búið til nýtt er alltaf með completed = false
    sem setja má með sjálfgefnu gildi í gagnagrunn
  - Sjá að neðan um staðfestingu gagna

TODO:
- Uppfæra verkefni eftir id með titli, loka dagsetningu,
  staðsetningu og hvort verkefni sé lokið eða ekki
*/

const xss = require('xss');
// eslint-disable-next-line import/no-extraneous-dependencies
const isISO8601 = require('validator/lib/isISO8601');

// Viðbót til að geta vistað gögn sem voru send inn í gagnagrunninn.
// Sækjum bara insertApplication fallið.
const {
  query,
} = require('./db');

function isEmpty(s) {
  return s == null && !s;
}


/**
 * Staðfestir að todo item sé gilt. Ef verið er að breyta item sem nú þegar er
 * til, þá er `patching` sent inn sem `true`.
 *
 * @param {TodoItem} todo Todo item til að staðfesta
 * @param {boolean} [patching=false]
 * @returns {array} Fylki af villum sem komu upp, tómt ef engin villa
 */
function validate({ title, due, position, completed } = {}, patching = false) {
  const errors = [];

  // ACTUALLY THIS !patching SHOULDN'T BE THERE, BUT IT'S HANDY TO SEE HOW IT COULD BE DONE
  // BECAUSE OF THIS IF STATEMENT, IT WOULD ACTUALLY POSSIBLE TO PATCH WITH A NON-STRING title.
  // HOWEVER, xss(title) ACTUALLY CONVERTS THAT TO STRING ANYWAY.
  if (!patching || !isEmpty(title)) {
    if (typeof title !== 'string' || title.length < 1 || title.length > 128) {
      errors.push({
        field: 'title',
        message: 'Title must be a string consisting of 1 to 128 characters.',
      });
    }
  }

  if (!isEmpty(due)) {
    if (typeof due !== 'string' || !isISO8601(due)) {
      errors.push({
        field: 'due',
        message: 'Due must be a valid ISO 8601 date.',
      });
    }
  }

  if (!isEmpty(position)) {
    if (typeof position !== 'number' || Number(position) < 0) {
      errors.push({
        field: 'position',
        message: 'Position must be a non-negative integer.',
      });
    }
  }

  if (!isEmpty(completed)) {
    if (typeof completed !== 'boolean') {
      errors.push({
        field: 'completed',
        message: 'Completed must be a boolean.',
      });
    }
  }

  return errors;
}


/**
 * Insert a row into todo.
 *
 * @param {object} todo Object with the following parameters:
 * {
    "title": non-empty string,
    "position": number,
    "due": timestamp with timezone
   }
 * @returns {boolean} Object representation of the newly inserted row
 */
async function insertRow({ title, due, position } = {}) {
  title = xss(title); // eslint-disable-line no-param-reassign
  // if due or position are undefined or false, set default values
  due = due ? xss(due) : null; // eslint-disable-line no-param-reassign
  // cast xss(position) from string to number
  position = position ? Number(xss(position)) : 0; // eslint-disable-line no-param-reassign

  // Validating input before inserting
  const validationResult = validate({ title, due, position });

  if (validationResult.length > 0) {
    return {
      success: false,
      notFound: false,
      validation: validationResult,
      todo: null,
    };
  }

  const q = `
    INSERT INTO todo
    (title, due, position)
    VALUES
    ($1, $2, $3) RETURNING *`;

  const result = await query(q, [title, due, position]);

  // Check if result is empty
  // TODO: could it be? Rather contains error? Could it contain errors after our validation?
  if (result.rows.length === 0) {
    console.error('todos.js insertRow() result.rows.length === 0...', result);
    return {
      success: false,
      notFound: true,
      validation: [],
      todo: null,
    };
  }

  return {
    success: true,
    notFound: false,
    validation: [],
    todo: result.rows[0],
  };
}


/**
 * Select all rows from todo
 * @param {string} order ORDER BY id DESC if order = 'desc'
 * @param {boolean} completed Select only rows where completed = true
 */
async function selectAllRows(order = '', completed = false) {
  // röðum eftir id í ascending (ASC) eða descending (DESC) röð
  // eftir því hvort boolean gildi sé satt eða ekki
  // Notum ekkert frá notanda í dýnamískrí fyrirspurn.
  const qOrder = (order.toLowerCase() === 'desc') ? 'id DESC' : 'id ASC';

  // console.log(completed);
  // console.log(Boolean(completed)); // Returns true if completed is defined!!! WTF
  const qCompleted = (
    completed === true || completed.toLowerCase() === 'true'
  ) ? 'WHERE completed = true ' : '';

  const q = `SELECT * FROM todo ${qCompleted}ORDER BY ${qOrder}`;

  const result = await query(q);

  return {
    success: true,
    todos: result.rows,
  };
}

/**
 * Select a row from todo.
 *
 * @param {number} id the row id
 * @returns {object} First row from database that matches this id
 */
async function selectRow(id) {
  const q = 'SELECT * FROM todo WHERE id = $1';

  const result = await query(q, [id]);

  // Check if result is empty
  if (result.rows.length === 0) {
    return {
      success: false,
      notFound: true,
      validation: [],
    };
  }

  return {
    success: true,
    todo: result.rows[0],
  };
}

/**
 * Delete a row from todo.
 *
 * @param {number} id the row id
 * @returns {boolean} true if exactly one row was deleted
 */
async function deleteRow(id) {
  const q = 'DELETE FROM todo WHERE id = $1 RETURNING *';

  const result = await query(q, [id]);

  // Check if result is empty
  if (result.rows.length === 0) {
    return {
      success: false,
      notFound: true,
    };
  }

  // Check if result is more than 1
  if (result.rows.length > 1) {
    console.error('todos.js deleteRow() result.rows.length > 1');
  }

  return {
    success: true,
    todo: result.rows[0],
  };
}

/**
 * Updates a row from todo.
 *
 * @param {object} todo Object with the following parameters:
 * {
    "title": non-empty string,
    "position": number,
    "due": timestamp with timezone,
 * }
 * @returns {boolean} Object representation of the newly updated row
 */
async function updateRow(id, { title, due, position, completed } = {}) {
  // Get the todo item that we're going to update
  const result = await selectRow(id);

  if (!result.success) {
    return result;
  }

  // if any field is undefined or null, set its value to the same that it was
  title = title ? xss(title) : result.todo.title; // eslint-disable-line no-param-reassign
  // if due or position are undefined or false, set default values (or whatever was in the table)
  due = due ? xss(due) : result.todo.due; // eslint-disable-line no-param-reassign
  // cast xss(position) from string to number
  // eslint-disable-next-line no-param-reassign
  position = position ? Number(xss(position)) : result.todo.position;
  // if completed is not exactly equal to false, set default value (or what was in the table)
  if (completed !== false) {
    // eslint-disable-next-line no-param-reassign
    completed = completed ? Boolean(xss(completed)) : result.todo.completed;
  } else {
    // eslint-disable-next-line no-param-reassign
    completed = Boolean(xss(completed));
  }

  // Validating input before inserting
  const validationResult = validate({ title, due, position, completed });

  if (validationResult.length > 0) {
    return {
      success: false,
      notFound: false,
      validation: validationResult,
      todo: null,
    };
  }

  const q = `
    UPDATE todo
    SET title = $2, due = $3, position = $4, completed = $5
    where id = $1
    RETURNING *`;

  const updateResult = await query(q, [id, title, due, position, completed]);

  // Check if result is empty
  // TODO: could it be? Rather contains error? Could it contain errors after our validation?
  if (updateResult.rows.length === 0) {
    console.error('todos.js updateRow() updateResult.rows.length === 0...', updateResult);
    return {
      success: false,
      notFound: false,
      validation: [],
      todo: null,
    };
  }

  return {
    success: true,
    notFound: false,
    validation: [],
    todo: updateResult.rows[0],
  };
}

module.exports = {
  selectAllRows,
  selectRow,
  deleteRow,
  insertRow,
  updateRow,
};
