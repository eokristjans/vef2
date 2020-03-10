// ÆTTI AÐ VERA TILBÚIÐ.
require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session'); // v3
const passport = require('passport'); // v3

const apply = require('./apply');
const applications = require('./applications');
const register = require('./register'); // v3
const admin = require('./admin'); // v3
const users = require('./users'); // v3 - being used but not as middleware

// Strategy um hvernig við ætlum að nálgast og eiga við notendur
const { Strategy } = require('passport-local'); // v3


const sessionSecret = process.env.SESSION_SECRET; // v3

// v3 - Leyfilegt er að setja upp virkni fyrir notendur í annari skrá en db.js.

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Erum að vinna með form, verðum að nota body parser til að fá aðgang að req.body
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/apply', apply);
app.use('/applications', applications);
app.use('/register', register); // v3
// app.use('/admin', admin); // v3 TODO: Uncomment after moving admin functionality there

/* todo setja upp login og logout virkni - mætti jafnvel vera í sér skrá. */

if (!sessionSecret) {
  console.error('Add SESSION_SECRET to .env');
  process.exit(1);
}

// Passport mun verða notað með session
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  maxAge: 20 * 1000, // 20 sek. TODO: Increase?
}));







/**
 * Athugar hvort username og password sé til í notandakerfi.
 * Callback tekur við villu sem fyrsta argument, annað argument er
 * - `false` ef notandi ekki til eða lykilorð vitlaust
 * - Notandahlutur ef rétt
 *
 * @param {string} username Notandanafn til að athuga
 * @param {string} password Lykilorð til að athuga
 * @param {function} done Fall sem kallað er í með niðurstöðu
 */
async function strat(username, password, done) {
  try {
    const user = await users.findByUsername(username);

    // Er notandi til?
    if (!user) {
      return done(null, false);
    }

    // Verður annað hvort notanda hlutur ef lykilorð rétt, eða false
    const result = await users.comparePasswords(password, user);
    return done(null, result);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}

// Notum local strategy með „strattinu“ okkar til að leita að notanda
passport.use(new Strategy(strat));

// Geymum id á notanda í session, það er nóg til að vita hvaða notandi þetta er
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Sækir notanda út frá id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Látum express nota passport með session
app.use(passport.initialize());
app.use(passport.session());

// Gott að skilgreina eitthvað svona til að gera user hlut aðgengilegan í
// view-um ef við erum að nota þannig
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    // getum núna notað user í view-um
    res.locals.user = req.user;
  }

  next();
});

// Hjálpar middleware sem athugar hvort notandi sé innskráður og hleypir okkur
// þá áfram, annars sendir á /login
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.send(`
      <p>Innskráning sem ${req.user.username}</p>
      <p>Þú ert ${req.user.admin ? 'admin.' : 'ekki admin.'}</p>
      <p><a href="/logout">Útskráning</a></p>
      <p><a href="/admin">Skoða leyndarmál</a></p>
    `);
  }

  return res.send(`
    <p><a href="/login">Innskráning</a></p>
  `);
});

// Þetta er semsagt login formið
app.get('/login', (req, res) => {

  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  let message = '';

  // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau
  // og hreinsum skilaboð
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  // EF VIÐ VÆRUM AÐ NOTA ejs ÞÁ VÆRI ÞETTA BARA res.render( MEÐ FORMINU )
  // Ef við breytum name á öðrum hvorum reitnum að neðan mun ekkert virka
  return res.send(`
    <form method="post" action="/login">
      <label>Notendanafn: <input type="text" name="username"></label>
      <label>Lykilorð: <input type="password" name="password"></label>
      <button>Innskrá</button>
    </form>
    <p>${message}</p>
  `);
  // REITIRNIR VERÐA AÐ HEITA username OG password SVO passport.authenticate VIRKI.
});

// Þetta er aðgerðin til að skrá sig inn
app.post(
  '/login',

  // Þetta notar strat að ofan til að skrá notanda inn
  passport.authenticate('local', {
    failureMessage: 'Notandi eða lykilorð vitlaust.',
    failureRedirect: '/login',
  }),

  // Ef við komumst hingað var notandi skráður inn, senda á /admin
  (req, res) => {
    res.redirect('/admin');
  },
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// ensureLoggedIn PASSAR AÐ HANN VERÐUR AÐ VERA SKRÁÐUR INN.
// Þarf ekki að vera admin m.v. núverandi stillingar.
app.get('/admin', ensureLoggedIn, (req, res) => {
  res.send(`
    <p>Hér eru leyndarmál</p>
    <p><a href="/">Forsíða</a></p>
  `);
});


/***************************************************************
 * Hingað mætti bæta við register formi og post (keimlíkt login)
 ***************************************************************/




/********** ERROR HANDLING MUST BE BELOW OTHER MIDDLEWARE **********/

/**
 * Hjálparfall til að athuga hvort reitur sé gildur eða ekki.
 *
 * @param {string} field Middleware sem grípa á villur fyrir
 * @param {array} errors Fylki af villum frá express-validator pakkanum
 * @returns {boolean} `true` ef `field` er í `errors`, `false` annars
 */
function isInvalid(field, errors) {
  return Boolean(errors.find(i => i.param === field));
}

app.locals.isInvalid = isInvalid;

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('error', { title: '404', error: '404 fannst ekki' });
}

function errorHandler(error, req, res, next) { // eslint-disable-line
  console.error(error);
  res.status(500).render('error', { title: 'Villa', error });
}

app.use(notFoundHandler);
app.use(errorHandler);



/********** HOSTNAME, PORT AND LISTEN AT THE ABSOLUTE BOTTOM **********/

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
