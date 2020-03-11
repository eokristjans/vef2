require('dotenv').config();

const fs = require('fs');
const util = require('util');

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

const readFileAsync = util.promisify(fs.readFile);

async function query(q) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q);

    const { rows } = result;
    return rows;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

async function main() {
  console.info(`Set upp gagnagrunn á ${connectionString}`);
  // droppa töflu ef til
  await query('DROP TABLE IF EXISTS application');
  await query('DROP TABLE IF EXISTS appuser');
  console.info('Töflum eytt');

  // búa til töflu út frá skema
  try {
    const createSchema = await readFileAsync('./setup/schema.sql');
    await query(createSchema.toString('utf8'));
    console.info('Schema sett upp');
  } catch (e) {
    console.error('Villa við að búa til töflur:', e.message);
    return;
  }

  // bæta færslum við töflur
  try {
    const insert = await readFileAsync('./setup/insert.sql');
    await query(insert.toString('utf8'));
    console.info('Gögnum bætt við');
  } catch (e) {
    console.error('Villa við að bæta gögnum við:', e.message);
  }
}

main().catch((err) => {
  console.error(err);
});
