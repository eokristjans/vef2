/** v3
 * Ný síða sýnir alla notendur á /users. 
 * Notendanöfn, nöfn og netföng eru sýnd. 
 * Ef notandi er admin má viðkomandi breyta admin stöðu allra notanda. 
 * Það er gert með því að haka í checkbox og senda form. 
 * 
 * Athugið að hægt er að fá fylki af gildum til baka úr formi 
 * með því að gefa þeim name sem endar á [], t.d. name="admin[]". 
 * 
 * Eftir að notendur eru uppfærðir er farið aftur á /users. 
 */

const express = require('express');

// Viðbót til að geta sótt og breytt gögnum sem eru í gagnagrunninum.
const {
  selectAllFromAppuserOrderById,
  selectFromAppuser,
  updateAppuserAdminStatus,
} = require('../DAOs/db');

const router = express.Router();

/**
 * Higher-order fall sem umlykur async middleware með villumeðhöndlun.
 *
 * @param {function} fn Middleware sem grípa á villur fyrir
 * @returns {function} Middleware með villumeðhöndlun
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/**
 * Ósamstilltur route handler fyrir lista yfir notendur.
 *
 * @param {object} req Request hlutu
 * @param {object} res Response hlutur
 * @returns {string} Lista af notendum
 */
async function users(req, res) {
  const list = await selectAllFromAppuserOrderById();

  const data = {
      title: 'Notendur',
      list,
  };
  
  // setjum current page (betra ef þetta væri aðgerð aðgengileg öllum)
  res.locals.page = 'users';

  return res.render('users', data);
}


/**
 * Ósamstilltur route handler sem uppfærir admin status á notendum
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/users`
 */
async function updateUsersAdminStatus(req, res) {
  const { admin } = req.body;

  if (admin == null) {
    // TODO: Error Message (can't remove admin status from EVERYONE)
    return res.redirect('/users')
  }

  // Iterate through the list and of all users and set admin status accordingly
  const list = await selectAllFromAppuserOrderById();
  await list.forEach(currentUser => {
    if (admin.includes(currentUser.id.toString()) && currentUser.admin != true) {
      updateAppuserAdminStatus(currentUser.id, true);
    }
    else if (currentUser.admin == true && !admin.includes(currentUser.id.toString())) {
      updateAppuserAdminStatus(currentUser.id, false);
    }
  });

  return res.redirect('/users');
}


router.get('/', catchErrors(users));
router.post('/', catchErrors(updateUsersAdminStatus));

module.exports = router;
