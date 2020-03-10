
const express = require('express');
const xss = require('xss');
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');

const users = require('./users'); // v3 - being used but not as middleware


// Viðbót til að geta vistað gögn sem voru send inn í gagnagrunninn.
// Sækjum bara insertUser fallið.
const { insertApplication } = require('./db'); // TODO: Breyta í insertUser


/* todo útfæra */
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

// TODO: Validation & Sanitazion



/**
 * Route handler fyrir form nýskráningar.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Form fyrir umsókn
 */
function registerForm(req, res) {
  const data = {
    // nafn samsvarar nafn í index.ejs
    title: 'Nýskráning',
    nafn: 'Admin',
    netfang: 'admin@example.org',
    username: 'admin', // current default
    password: '123', // current default
    errors: [],
  };
  res.render('registerForm', data);
}


/**
 * Route handler sem athugar stöðu á nýskráningar og birtir villur ef einhverjar,
 * sendir annars áfram í næsta middleware.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 * @returns Næsta middleware ef í lagi, annars síðu með villum
 */
function showErrors(req, res, next) {
  const {
    body: {
      nafn = '',
      netfang = '',
      username = '',
      password = '',
    } = {},
  } = req;

  const data = {
    nafn, netfang, username, password,
  };

  /* TODO: Add validation result
  const validationRes = validationResult(req);

  if (!validationRes.isEmpty()) {
    const errors = validationRes.array();
    data.errors = errors;
    data.title = 'Nýskráning - vandræði';

    return res.render('registerForm', data);
  }
  */

  return next();
}


/**
 * Ósamstilltur route handler sem vistar gögn í gagnagrunn og sendir
 * á þakkarsíðu
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
async function formPost(req, res) {
  const {
    body: {
      nafn = '',
      netfang = '',
      username = '',
      password = '',
    } = {},
  } = req;

  await users.createUser(nafn, netfang, username, password);
  
  return res.redirect('/register/thanks');
}

/**
 * Route handler fyrir þakkarsíðu.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
function thanks(req, res) {
  return res.render('thanks', { title: 'Takk fyrir að skrá þig' });
}

router.get('/', registerForm);
router.get('/thanks', thanks);


// passa að senda validation og sanitazion fylkin með í post fallið.
router.post(
  '/',
  //validations, // Athugar hvort form sé í lagi
  showErrors, // Ef form er ekki í lagi, birtir upplýsingar um það
  //sanitazions, // Öll gögn í lagi, hreinsa þau
  catchErrors(formPost), // Senda gögn í gagnagrunn
);
  

module.exports = router;