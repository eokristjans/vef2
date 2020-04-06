module.exports = 
/**
 * A middleware that catches errors thrown in async function fn
 * 
 * @param {function} fn async function
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
};