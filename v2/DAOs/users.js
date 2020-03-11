/* v3 - Hjálparföll um notendur og meðhöndlun þeirra */



// Viðbót til að geta vistað gögn sem voru send inn í gagnagrunninn.
// Sækjum bara insertApplication fallið.
const {
  insertAppuser,
  selectFromAppuser,
  selectFromAppuserWhereUsernameEquals,
  selectAllFromAppuserOrderById,
  updateAppuserAdminStatus,
} = require('./db');

const bcrypt = require('bcrypt');
const saltRounds = 10;


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
async function findByUsername(username) {
  const list = await selectFromAppuserWhereUsernameEquals(username);

  if (list == null || list[0] == null) {
    // TODO: Error??
    return null;
  }

  return list[0];
}

async function findById(id) {
  const list = await selectFromAppuser(id);

  if (list == null || list[0] == null) {
    // TODO: Error??
    return null;
  }

  return list[0];
}

async function createUser(nafn, netfang, username, password) {

  console.log('Creating user with username: ' + username);

  // Hash the password, do not store the password any longer than necessary.
  await bcrypt.hash(password, saltRounds, function (err, hash) {
    // Store the user immediately.
    insertAppuser(nafn, netfang, username, hash, false);
  });
}

module.exports = {
  comparePasswords,
  findByUsername,
  findById,
  createUser,
};
