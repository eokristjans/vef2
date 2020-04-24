
const express = require('express');
const helmet = require('helmet');

// Enforce ssl for security
const expressEnforcesSSL = require('express-enforces-ssl');

// Limit # of requests per user
const rateLimiterRedisMiddleware = require('./rateLimiterRedis');


const app = express();
app.use(express.json());

app.use(helmet()); // Security, set headers.

const twoYearsInSeconds = 63072000;
app.use(helmet.hsts({
  maxAge: twoYearsInSeconds,
  includeSubDomains: true,
  preload: true,
}));

const {
  // Get info from .env
  ENVIRONMENT: env = 'production',
} = process.env;

// These settings do not work on localhost
if (env === 'production') {
  // Redirects use to https connection
  // throws an error if users try to send data via http.
  app.enable('trust proxy');
  app.use(expressEnforcesSSL());

  // Does not work on localhost unless you have redis-server running
  // Limits the number of requests made per duration by IP
  app.use(rateLimiterRedisMiddleware);
}

module.exports = app;
