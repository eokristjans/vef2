/* v3 - Hjálparföll um notendur og meðhöndlun þeirra */

/* todo útfæra virkni fyrir notendur - bæta við gagnagrunni */


const bcrypt = require('bcrypt');

/***************************************************************
 * Einhverjir default users sem ætti að geyma í gagnagrunni 
 * frekar en minni til að gera láta session endast lengur.
 ***************************************************************/
const records = [
  // Erum ekki að hash-a lykilorð, því þá væru þau mismunandi.
  {
    id: 1,
    username: 'admin',
    // Afrit af lykilorði sem er er búið að hash-a
    password: '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', // 123
    // TODO: change password to encrypted asdfasdf
    name: 'Admin',
    email: 'admin@example.org',
    admin: true,
  },
  {
    id: 2,
    username: 'n',
    password: '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii', // 123
    // TODO: change password to encrypted 12341234
    name: 'Nafnlaus',
    email: 'nn@example.org',
    admin: false,
  },
];

async function comparePasswords(password, user) {
  const ok = await bcrypt.compare(password, user.password);

  if (ok) {
    return user;
  }

  return false;
}

/***************************************************************
 * Þessu þyrfti þá að breyta til að sækja notendur í gagnagrunn.
 ***************************************************************/
function findByUsername(username) {
  const found = records.find(u => u.username === username);

  if (found) {
    return Promise.resolve(found);
  }

  return Promise.resolve(null);
}

function findById(id) {
  const found = records.find(u => u.id === id);

  if (found) {
    return Promise.resolve(found);
  }

  return Promise.resolve(null);
}

module.exports = {
  comparePasswords,
  findByUsername,
  findById,
};
