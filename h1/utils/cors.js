module.exports = 

/**
 * A middleware for Express app that sets Cross-Origin Resource Sharing (CORS)
 * to tell browsers to give a web application running at one origin, 
 * access to selected resources from a different (this) origin.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function cors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  next();
};