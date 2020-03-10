/**
 * Ný síða sýnir alla notendur á /admin. 
 * Notendanöfn, nöfn og netföng eru sýnd. 
 * Ef notandi er admin má viðkomandi breyta admin stöðu allra notanda. 
 * Það er gert með því að haka í checkbox og senda form. 
 * 
 * Athugið að hægt er að fá fylki af gildum til baka úr formi 
 * með því að gefa þeim name sem endar á [], t.d. name="admin[]". 
 * 
 * Eftir að notendur eru uppfærðir er farið aftur á /admin. 
 */

const express = require('express');

// Viðbót til að geta sótt og breytt gögnum sem eru í gagnagrunninum.
const {
  selectAllFromAppuserOrderById,
  updateAppuserAdminStatus
} = require('./db');

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

  return res.render('admin', data);
}

router.get('/', catchErrors(users));

module.exports = router;