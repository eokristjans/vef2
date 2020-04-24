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
const {
  uploadImagesFromDisk,
  /* TODO: Implement something similar
  createFakeCategories,
  createFakeProducts,
*/
} = require('./data/images');

const readFileAsync = util.promisify(fs.readFile);

requireEnv(['DATABASE_URL', 'CLOUDINARY_URL']);

const {
  DATABASE_URL: databaseUrl,
  CLOUDINARY_URL: cloudinaryUrl,
  NUMBER_OF_FAKE_CATEGORIES: numberOfFakeCategories = 12,
  NUMBER_OF_FAKE_PRODUCTS: numberOfFakeProducts = 100,
  IMAGE_FOLDER: imageFolder = './img',
} = process.env;

async function main() {
  console.info(`Setting up database at ${databaseUrl}`);
  console.info(`Setting up connection with Cloudinary at ${cloudinaryUrl}`);

  // Array with images and links to Cloudinary
  let images = [];

  // Drop tables
  try {
    const createTable = await readFileAsync('./sql/drop-tables.sql');
    await query(createTable.toString('utf8'));
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

  // send pictures to Cloudinary
  try {
    images = await uploadImagesFromDisk(imageFolder);
    console.info(`Sendi ${images.length} myndir á Cloudinary`);
  } catch (e) {
    console.error('Villa við senda myndir á Cloudinary:', e.message);
  }

  /* TODO: Create something similar
  // búa til gervigögn og setja í gagnagrunn
  try {
    const categories = await createFakeCategories(numberOfFakeCategories);
    const products =
      await createFakeProducts(numberOfFakeProducts, categories, images);

    const cats = categories.length;
    const prods = products.length;

    console.info(`Bjó til ${cats} flokka og ${prods} vörur.`);
  } catch (e) {
    console.error('Villa við að búa til gervigögn:', e.message);
    return;
  }
  */

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