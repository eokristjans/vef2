/**
 * Initializes database and data for the project.
 * Starts by dropping all existing tables and recreates them.
 *
 * Data is created with Faker.
 * Images are stored on Cloudinary.
 *
 */

require('dotenv').config();

const fs = require('fs');
const util = require('util');

const requireEnv = require('./utils/requireEnv');
const { query } = require('./utils/db');
const { uploadImagesFromDisk } = require('./data/images');
const { createUserContents } = require('./api/notebook-helpers');


const readFileAsync = util.promisify(fs.readFile);

requireEnv(['DATABASE_URL', 'CLOUDINARY_URL']);

const {
  DATABASE_URL: databaseUrl,
  CLOUDINARY_URL: cloudinaryUrl,
  IMAGE_FOLDER: imageFolder = './data/img',
} = process.env;

async function main() {
  console.info(`Setting up database at ${databaseUrl}`);
  console.info(`Setting up connection with Cloudinary at ${cloudinaryUrl}`);

  // Array with images and links to Cloudinary
  let images = [];

  // Drop tables
  try {
    const dropTable = await readFileAsync('./sql/drop-tables.sql');
    await query(dropTable.toString('utf8'));
    console.info('Tables dropped.');
  } catch (e) {
    console.error('Error while dropping tables:', e.message);
    return;
  }

  // Create tables from schema
  try {
    const createTable = await readFileAsync('./sql/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Tables created.');
  } catch (e) {
    console.error('Error while creating tables:', e.message);
    return;
  }

  // Create users
  try {
    const createData = await readFileAsync('./sql/insert-users.sql');
    await query(createData.toString('utf8'));
    console.info('Users created.');
  } catch (e) {
    console.error('Error while creating users:', e.message);
    return;
  }

  // Create the default sign-up data for the first two users.
  try {
    await createUserContents(1);
    await createUserContents(2);
  } catch (e) {
    console.error('Error while creating some user content:'. e.message);
  }

  // send pictures to Cloudinary
  try {
    images = await uploadImagesFromDisk(imageFolder);
    console.info(`Sending ${images.length} images to Cloudinary`);
  } catch (e) {
    console.error('Error while sending pictures to Cloudinary:', e.message);
  }

  // Create notebooks
  try {
    const createData = await readFileAsync('./sql/insert-notebooks.sql');
    await query(createData.toString('utf8'));
    console.info('Notebooks created.');
  } catch (e) {
    console.error('Error while creating notebooks:', e.message);
  }
}

main().catch((err) => {
  console.error(err);
});
