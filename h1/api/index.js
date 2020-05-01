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
  deleteUserRoute,
} = require('./users');

const {
  readNotebooksRoute,
  readNotebookRoute,
  readNotebooksWithSectionsWithPagesRoute,
  createNotebookRoute,
  updateNotebookRoute,
  deleteNotebookRoute,
} = require('./notebooks');

const {
  readSectionRoute,
  createSectionRoute,
  updateSectionRoute,
  deleteSectionRoute,
} = require('./sections');

const {
  readPageRoute,
  createPageRoute,
  updatePageRoute,
  deletePageRoute,
} = require('./pages');

const {
  createImageRoute,
  readImageRoute,
  readImagesRoute,
  deleteImageRoute,
} = require('./images');

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
      notebooksWithSectionsWithPagesRoute: '/notebooks-with-contents',
    },
    sections: {
      sections: '/sections/',
      section: '/sections/{id}',
    },
    pages: {
      pages: '/pages/',
      page: '/pages/{id}',
    },
    images: {
      images: '/images/',
      image: '/images/{id}',
    },
  });
}

router.get('/', indexRoute);

/** Add routes to router */

// User actions by admin
router.get('/users', requireAdmin, catchErrors(readUsersRoute));
router.get('/users/:id', requireAdmin, catchErrors(readUserRoute));
router.patch('/users/:id', requireAdmin, catchErrors(updateUser));
router.delete('/users/:id', requireAdmin, catchErrors(deleteUserRoute));

// User actions by self
router.get('/users/me', requireAuth, catchErrors(currentUser));
router.patch('/users/me', requireAuth, catchErrors(updateCurrentUser));

// Notebook actions by users
router.get('/notebooks-with-contents', requireAuth, catchErrors(readNotebooksWithSectionsWithPagesRoute));
router.get('/notebooks', requireAuth, catchErrors(readNotebooksRoute));
router.post('/notebooks', requireAuth, catchErrors(createNotebookRoute));
router.get('/notebooks/:id', requireAuth, catchErrors(readNotebookRoute));
router.patch('/notebooks/:id', requireAuth, catchErrors(updateNotebookRoute));
router.delete('/notebooks/:id', requireAuth, catchErrors(deleteNotebookRoute));

// Section actions by users
router.post('/sections', requireAuth, catchErrors(createSectionRoute));
router.get('/sections/:id', requireAuth, catchErrors(readSectionRoute));
router.patch('/sections/:id', requireAuth, catchErrors(updateSectionRoute));
router.delete('/sections/:id', requireAuth, catchErrors(deleteSectionRoute));

// Page actions by users
router.post('/pages', requireAuth, catchErrors(createPageRoute));
router.get('/pages/:id', requireAuth, catchErrors(readPageRoute));
router.patch('/pages/:id', requireAuth, catchErrors(updatePageRoute));
router.delete('/pages/:id', requireAuth, catchErrors(deletePageRoute));

// Image actions by users
router.get('/images', requireAuth, catchErrors(readImagesRoute));
router.post('/images', requireAuth, catchErrors(createImageRoute));
router.get('/images/:id', requireAuth, catchErrors(readImageRoute));
router.delete('/images/:id', requireAuth, catchErrors(deleteImageRoute));

// export the router
module.exports = router;

