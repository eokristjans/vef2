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

const {
  readNotebooksRoute,
  readNotebookRoute,
  createNotebookRoute,
  updateNotebookRoute,
} = require('./notebooks');

const {
  readSectionRoute,
  createSectionRoute,
  updateSectionRoute,
} = require('./sections');

const {
  readPageRoute,
  createPageRoute,
} = require('./pages');

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
    notebooks: {
      notebooks: '/notebooks',
      notebook: '/notebooks/{id}',
    },
    sections: {
      sections: '/sections/',
      section: '/sections/{id}',
    },
    pages: {
      pages: '/pages/',
      page: '/pages/{id}',
    },
    // TODO: Add other endpoints
  });
}

router.get('/', indexRoute);

// Add routes to router
router.get('/users', requireAdmin, catchErrors(readUsersRoute));
router.get('/users/me', requireAuth, catchErrors(currentUser));
router.patch('/users/me', requireAuth, catchErrors(updateCurrentUser));
router.get('/users/:id', requireAdmin, catchErrors(readUserRoute));
router.patch('/users/:id', requireAdmin, catchErrors(updateUser));

router.get('/notebooks', requireAuth, catchErrors(readNotebooksRoute));
router.post('/notebooks', requireAuth, catchErrors(createNotebookRoute));
router.get('/notebooks/:id', requireAuth, catchErrors(readNotebookRoute));
router.patch('/notebooks/:id', requireAuth, catchErrors(updateNotebookRoute));

router.post('/sections', requireAuth, catchErrors(createSectionRoute));
router.get('/sections/:id', requireAuth, catchErrors(readSectionRoute));
router.patch('/sections/:id', requireAuth, catchErrors(updateSectionRoute));

router.get('/pages/:id', requireAuth, catchErrors(readPageRoute));
router.post('/pages', requireAuth, catchErrors(createPageRoute));

// export the router
module.exports = router;
