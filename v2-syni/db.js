const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL; // sótt úr env gegnum dotenv pakka

/* todo útfæra */
const client = new Client({
  connectionString,
});

async function insert(name) {
  client.connect();
  try {
    const query = 'INSERT INTO students (name) VALUES ($1)';
    const res = await client.query(query, [name]);
    console.log(res.rows);
  } catch (err) {
    console.log(err);
    throw err;
  }
}


module.exports = {
  insert,
  // Getum bætt við föllum eins og update.
};
