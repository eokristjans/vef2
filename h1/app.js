require('dotenv').config();

const express = require('express');

const noCache = require('./security/noCache');
const cors = require('./security/cors');
const helmetApp = require('./security/helmetApp');
const auth = require('./auth/auth');
// Import the entire folder
const api = require('./api');

/** TODO: Necessary?
const requireEnv = require('./utils/requireEnv');

requireEnv([
  'DATABASE_URL',
  'CLOUDINARY_URL',
  'JWT_SECRET',
]);

const {
  DATABASE_URL: databaseUrl,
  CLOUDINARY_URL: cloudinaryUrl,
  IMAGE_FOLDER: imageFolder = './img',
} = process.env;
 */

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

const app = express();
app.use(express.json());

// Web service security
app.use(helmetApp);
app.use(noCache);
app.use(cors);

// User management security
app.use(auth);

// Contains all routes
app.use('/', api);


/** ERROR HANDLING MUST BE BELOW OTHER MIDDLEWARE */

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
