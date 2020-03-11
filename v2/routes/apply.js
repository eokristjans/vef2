// ÆTTI AÐ VERA TILBÚIÐ.
//const util = require('util');
const express = require('express');
const xss = require('xss');
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');

// Middleware til að vinna úr gögnum og ná í innihald þeirra.
//const multer = require('multer');

//const upload = util.promisify(multer({ dest: 'uploads/' }).single('file'));

// Viðbót til að geta vistað gögn sem voru send inn í gagnagrunninn.
// Sækjum bara insertApplication fallið.
const { insertApplication } = require('../DAOs/db');

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
 * Hjálparfall sem XSS hreinsar reit í formi eftir heiti.
 *
 * @param {string} fieldName Heiti á reit
 * @returns {function} Middleware sem hreinsar reit ef hann finnst
 */
function sanitizeXss(fieldName) {
  return (req, res, next) => {
    if (req.body) {
      const field = req.body[fieldName];

      if (field) {
        req.body[fieldName] = xss(field);
      }
    }

    next();
  };
}

// Fylki af öllum validations fyrir umsókn
const validations = [
  check('nafn')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt.'),

  check('netfang')
    .isLength({ min: 1 })
    .withMessage('Netfang má ekki vera tómt.'),

  check('netfang')
    .isEmail()
    .withMessage('Netfang verður að vera á réttu sniði.'),

  check('simi')
    .matches(/^[0-9]{3}( |-)?[0-9]{4}$/)
    .withMessage('Símanúmer verður að vera 7 tölustafir'),

  check('kynning')
    .isLength({ min: 100 })
    .withMessage('Kynning verður að vera að minnsta kosti 100 bókstafir.'),

  check('starf')
    .custom(value => ['forritari', 'hönnuður', 'verkefnastjóri'].indexOf(value) >= 0)
    .withMessage('Velja verður starf.'),
];

// Fylki af öllum hreinsunum fyrir umsókn
const sanitazions = [
  // .escape() passar að ekkert HTML fari með.
  sanitize('nafn').trim().escape(),
  sanitizeXss('nafn'),

  // Sýnilausn kallar fyrst á sanitizeXss... skiptir það máli?
  sanitize('netfang').trim().normalizeEmail(),
  sanitizeXss('netfang'),

  sanitize('simi').trim().blacklist(' ').escape(),
  sanitizeXss('simi'),

  sanitize('kynning').trim().escape(),
  sanitizeXss('kynning'),

  sanitize('starf').trim().escape(),
  sanitizeXss('starf'),
];


/**
 * Route handler fyrir form umsóknar.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Form fyrir umsókn
 */
function form(req, res) {
  const data = {
    // nafn samsvarar nafn í index.ejs
    title: 'Atvinnuumsókn',
    nafn: 'default apply.js form',
    netfang: 'default@apply.js',
    simi: '1234567',
    kynning: 'qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop',
    starf: 'forritari',
    errors: [],
  };
  
  // setjum current page (betra ef þetta væri aðgerð aðgengileg öllum)
  res.locals.page = 'apply';

  res.render('form', data);
}

/**
 * Route handler sem athugar stöðu á umsókn og birtir villur ef einhverjar,
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
      simi = '',
      kynning = '',
      starf = '',
    } = {},
  } = req;

  const data = {
    nafn, netfang, simi, kynning, starf,
  };

  const validationRes = validationResult(req);

  if (!validationRes.isEmpty()) {
    const errors = validationRes.array();
    data.errors = errors;
    data.title = 'Atvinnuumsókn - vandræði';

    return res.render('form', data);
  }

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
      simi = '',
      kynning = '',
      starf = '',
    } = {},
  } = req;

  await insertApplication(nafn, netfang, simi, kynning, starf);

  return res.redirect('/apply/thanks');
}

/**
 * Route handler fyrir þakkarsíðu.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
function thanks(req, res) {
  return res.render('thanks', { title: 'Takk fyrir umsóknina' });
}


router.get('/', form);
router.get('/apply/thanks', thanks);

// passa að senda validation og sanitazion fylkin með í post fallið.
router.post(
  '/apply',
  sanitazions, // Hreinsa gögn áður en þau eru valideruð
  validations, // Athugar hvort form sé í lagi
  showErrors, // Ef form er ekki í lagi, birtir upplýsingar um það
  catchErrors(formPost), // Senda gögn í gagnagrunn
);

module.exports = router;
