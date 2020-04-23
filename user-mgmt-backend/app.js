require('dotenv').config();

const express = require('express');

const requireEnv = require('./utils/requireEnv');

const cors = require('./utils/cors');
const auth = require('./auth/auth');
// Import the entire folder
const api = require('./api');

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

const app = express();
app.use(express.json());

app.use(cors);
app.use(auth);
app.use('/', api);

// TODO: user management first :)


//********* ERROR HANDLING MUST BE BELOW OTHER MIDDLEWARE *********

function notFoundHandler(req, res, next) { // eslint-disable-line
  console.warn('Not found', req.originalUrl);
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Launch server and listen for connections at given port.
 */
app.listen(port, () => {
  if (host) {
    console.info(`Server running at http://${host}:${port}/`);
  }
});
