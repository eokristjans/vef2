// Sýnidæmi viðbót (allt forrit)
const express = require('express');
const { check, validationResult } = require('express-validator/check');

// Viðbót til að geta vistað gögn sem voru send inn í gagnagrunninn. Sækjum bara insert fallið.
const { insert } = require('./db');

const router = express.Router();

// Higher order fall
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const validation = [
  check('name').isLength({ min: 1 }).withMessage( 
    'Nafn má ekki vera tómt.'),
];

const sanitazion = [

];

function form(req, res) {
  // Ef við erum búin að setja um body middleware þá á þetta að duga.
  // const { name } = req.body;
  
  // Ef body er ekki til, þá á það að vera tómt, og ef name er ekki til þá á það að vera undefined.
  // Þurfum að gera svona því við erum ekki búnir að setja upp middleware fyrir body.
  const { body: { name } = {} } = req;

  res.render('index', { name: '', errors: [] }); // name samsvarar name í index.ejs
}

async function register(req, res) {
  const { body: { name } = {} } = req;

  // Tekur inn validation hlutinn og segir hvort hann er í lagi eða ekki.
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    try {
      await insert(name);
    } catch (e) {
      console.log('Gat ekki buid til nemanda', name, e);
      throw e;
    }
    res.render('thanks'); // þakkarsíða
  } else {
    const errorMessages = errors.array();
    res.render('index', { name, errors: errorMessages });
  }
}

router.get('/', catchErrors(form));
// passa að senda validation og sanitazion fylkin með í post fallið.
router.post('/register', validation, sanitazion, catchErrors(register));

module.exports = router;
