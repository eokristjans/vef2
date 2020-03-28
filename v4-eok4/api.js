const express = require('express');

// Import from todos.js
const {
  selectAllRows,
  selectRow,
  deleteRow,
  insertRow,
  updateRow,
} = require('./todos.js');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// *************************** Web Service Interface ***************************

// ROUTES DO NOT PROCESS USER INPUT, BUT THEY MUST HANDLE EXCEPTIONS FROM todos.js

// TODO: Could make api.js sanitize and validate input using middleware
// (better than what todos.js does)


async function listRoute(req, res) {
  // Get query parameters from req.query
  const { order, completed } = req.query;

  const todos = await selectAllRows(order, completed);

  return res.json(todos);
}

async function getRoute(req, res) {
  // Get id parameter from req.param
  const { id } = req.params;

  const result = await selectRow(id);

  if (!result.success && result.notFound) {
    return res.status(404).json({ error: 'Item not found' });
  }

  return res.status(200).json(result);
}

async function deleteRoute(req, res) {
  // Get id parameter from req.param
  const { id } = req.params;

  const result = await deleteRow(id);

  if (!result.success && result.notFound) {
    return res.status(404).json({ error: 'Item not found' });
  }

  return res.status(200).json(result.todo);
}

async function postRoute(req, res) {
  // Extract only the parameters that we need from the request body,
  // rather than sending potentially unuseful info forward.
  const { title, due, position } = req.body;

  const result = await insertRow({ title, due, position });

  if (!result.success && result.notFound) {
    return res.status(404).json({ error: 'Item not found' });
  }

  if (!result.success && result.validation.length > 0) {
    return res.status(400).json(result.validation);
  }

  return res.status(200).json(result.todo);
}

async function patchRoute(req, res) {
  const { id } = req.params;
  const { title, due, position, completed } = req.body;

  const result = await updateRow(id, { title, due, position, completed });

  if (!result.success && result.notFound) {
    return res.status(404).json({ error: 'Item not found' });
  }

  if (!result.success && result.validation.length > 0) {
    return res.status(400).json(result.validation);
  }


  return res.status(200).json(result.todo);
}


router.get('/', catchErrors(listRoute));
router.get('/:id', catchErrors(getRoute));
router.post('/', catchErrors(postRoute));
router.patch('/:id', catchErrors(patchRoute));
router.delete('/:id', catchErrors(deleteRoute));

module.exports = router;
