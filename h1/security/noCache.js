
/**
 * Middleware that sets HTTP header "Cache-Control: no-store, no-cache"
 * and "Pragma: no-cache".
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {function} next
 */
function noCache(req, res, next) {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader(
    'Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate',
  );
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}

module.exports = noCache;
