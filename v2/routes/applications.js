const express = require('express');

// Viðbót til að geta sótt og breytt gögnum sem eru í gagnagrunninum.
const { 
  selectAllFromApplicationOrderById, 
  updateApplicationSetProcessedEqualsTrue, 
  deleteApplication 
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
 * Ósamstilltur route handler fyrir umsóknarlista.
 *
 * @param {object} req Request hlutu
 * @param {object} res Response hlutur
 * @returns {string} Lista af umsóknum
 */
async function applications(req, res) {
  const list = await selectAllFromApplicationOrderById();

  const data = {
    title: 'Umsóknir',
    list,
  };
  
  // setjum current page (betra ef þetta væri aðgerð aðgengileg öllum)
  res.locals.page = 'applications';

  return res.render('applications', data);
}

/**
 * Ósamstilltur route handler sem vinnur úr umsókn.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/applications`
 */
async function processApplication(req, res) {
  const { id } = req.body;

  await updateApplicationSetProcessedEqualsTrue(id);

  return res.redirect('/applications');
}

/**
 * Ósamstilltur route handler sem hendir umsókn.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/applications`
 */
async function eydaUmsokn(req, res) {
  const { id } = req.body;

  await deleteApplication(id);

  return res.redirect('/applications');
}

router.get('/', catchErrors(applications));
router.post('/process', catchErrors(processApplication));
router.post('/delete', catchErrors(eydaUmsokn));

module.exports = router;
