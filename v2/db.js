// ÆTTI AÐ VERA TILBÚIÐ.
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL; // sótt úr env gegnum dotenv pakka

/**
 * Framkvæmir SQL fyrirspurn á gagnagrunn sem keyrir á `DATABASE_URL`,
 * skilgreint í `.env`
 *
 * @param {string} q Query til að keyra
 * @param {array} values Fylki af gildum fyrir query
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function query(q, values = []) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q, values);

    return result;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

/********************** APPLICATION CRUD **********************/

/**
 * Bætir við umsókn.
 *
 * @param {array} data Fylki af gögnum fyrir umsókn
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function insertApplication(nafn, netfang, simi, kynning, starf) {
  const q = `
  INSERT INTO application
   (nafn, netfang, simi, kynning, starf) 
   VALUES 
   ($1, $2, $3, $4, $5)`;
  const values = [nafn, netfang, simi, kynning, starf];
  return query(q, values);
}

/**
 * Sækir allar umsóknir
 *
 * @returns {array} Fylki af öllum umsóknum
 */
async function selectAllFromApplicationOrderById() {
  const result = await query('SELECT * FROM application ORDER BY id');

  return result.rows;
}

/**
 * Uppfærir umsókn sem unna.
 *
 * @param {string} id Id á umsókn
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function updateApplicationSetProcessedEqualsTrue(id) {
  const q = `
    UPDATE application
    SET processed = true, updated = current_timestamp
    WHERE id = $1`;

  return query(q, [id]);
}

/**
 * Eyðir umsókn.
 *
 * @param {string} id Id á umsókn
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function deleteApplication(id) {
  const q = 'DELETE FROM application WHERE id = $1';

  return query(q, [id]);
}



/********************** APPUSER CRUD **********************/


/**
 * Bætir við user.
 *
 * @param {array} data Fylki af gögnum fyrir notanda
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function insertAppuser(nafn, netfang, username, password, admin) {
  const q = `
  INSERT INTO appuser
   (nafn, netfang, username, password, admin) 
   VALUES 
   ($1, $2, $3, $4, $5)`;
  const values = [nafn, netfang, username, password, admin];
  return query(q, values);
}

/**
 * Sækir alla notendur
 *
 * @returns {array} Fylki af öllum notendum
 */
async function selectAllFromAppuserOrderById() {
  const result = await query('SELECT * FROM appuser ORDER BY id');

  return result.rows;
}


/**
 * Sækir notanda
 *
 * @param {string} id Id á notanda
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function selectFromAppuser(id) {
  const result = await query('SELECT * FROM appuser WHERE id = $1', [id]);

  return result.rows;
}

/**
 * Sækir notanda
 *
 * @param {string} username username á notanda
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function selectFromAppuserWhereUsernameEquals(username) {
  const result = await query('SELECT * FROM appuser WHERE username = $1', [username]);

  return result.rows;
}

/**
 * Stillir admin status á notanda.
 *
 * @param {string} id Id á notanda
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function updateAppuserAdminStatus(id, admin) {
  const q = `
    UPDATE appuser
    SET admin = $2, updated = current_timestamp
    WHERE id = $1`;

  return query(q, [id, admin]);
}

/**
 * Eyðir notanda.
 *
 * @param {string} id Id á notanda
 * @returns {object} Hlut með niðurstöðu af því að keyra fyrirspurn
 */
async function deleteAppuser(id) {
  const q = 'DELETE FROM appuser WHERE id = $1';

  return query(q, [id]);
}



module.exports = {
  insertApplication,
  selectAllFromApplicationOrderById,
  updateApplicationSetProcessedEqualsTrue,
  deleteApplication,
  insertAppuser,
  selectAllFromAppuserOrderById,
  selectFromAppuser,
  selectFromAppuserWhereUsernameEquals,
  updateAppuserAdminStatus,
  deleteAppuser,
};
