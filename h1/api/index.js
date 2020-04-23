const express = require('express');
const catchErrors = require('../utils/catchErrors');

const { requireAuth, checkUserIsAdmin } = require('../auth/auth');
// put middleware together to use sequentially
const requireAdmin = [
  requireAuth,
  checkUserIsAdmin,
];

// ******************** API IMPORTS ******************** 
const {
  readUsersRoute,
  readUserRoute,
  updateUser,
  currentUser,
  updateCurrentUser,
} = require('./users');


const router = express.Router();

/**
 * Lists and links to all available routes in the api
 * 
 * @param {object} req 
 * @param {object} res 
 */
function indexRoute(req, res) {
  return res.json({
    users: {
      users: '/users',
      user: '/users/{id}',
      register: '/users/register',
      login: '/users/login',
      me: '/users/me',
    },
    // TODO: Add other endpoints
  });
}

router.get('/', indexRoute);

// add routes to router
router.get('/users', requireAdmin, catchErrors(readUsersRoute));
router.get('/users/me', requireAuth, catchErrors(currentUser));
router.patch('/users/me', requireAuth, catchErrors(updateCurrentUser));
router.get('/users/:id', requireAdmin, catchErrors(readUserRoute));
router.patch('/users/:id', requireAdmin, catchErrors(updateUser));

// export the router
module.exports = router;