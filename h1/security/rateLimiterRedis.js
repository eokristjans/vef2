// Limits the number of requests that each IP address can send per
// specified duration, e.g. 5 requests per 1 second by IP.

const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const {
  REDIS_HOST: redisHost = '',
  REDIS_PORT: redisPort = 12549,
} = process.env;

const redisClient = redis.createClient({
  url: `redis://${redisHost}:${redisPort}/`,
  enable_offline_queue: false,
});

const rateLimiter = new RateLimiterRedis({
  redis: redisClient,
  keyPrefix: 'middleware',
  // TODO: get from .env?
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter.consume(req.ip)
    .then(() => {
      // console.log('rateLimiterMiddleware' + req.ip);
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};

module.exports = rateLimiterMiddleware;
