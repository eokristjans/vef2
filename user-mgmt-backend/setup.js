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
  console.info(`Set upp gagnagrunn á ${databaseUrl}`);
  console.info(`Set upp tengingu við Cloudinary á ${cloudinaryUrl}`);

  // Fylki með myndum og slóðum á Cloudinary
  let images = [];

  // henda töflum
  try {
    const createTable = await readFileAsync('./sql/drop-tables.sql');
    await query(createTable.toString('utf8'));
    console.info('Töflum hent');
  } catch (e) {
    console.error('Villa við að henda töflum:', e.message);
    return;
  }

  // búa til töflur út frá skema
  try {
    const createTable = await readFileAsync('./sql/schema.sql');
    await query(createTable.toString('utf8'));
    console.info('Tafla búin til');
  } catch (e) {
    console.error('Villa við að búa til töflu:', e.message);
    return;
  }

  // búa til notendur
  try {
    const createData = await readFileAsync('./sql/insert-users.sql');
    await query(createData.toString('utf8'));
    console.info('Notendur búnir til');
  } catch (e) {
    console.error('Villa við að búa til notendur:', e.message);
    return;
  }

  // senda myndir á Cloudinary
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

  // búa til pantanir og körfu
  try {
    const createData = await readFileAsync('./sql/insert-orders.sql');
    await query(createData.toString('utf8'));
    console.info('Pantanir og körfur búnar til');
  } catch (e) {
    console.error('Villa við að búa til pantanir og körfur:', e.message);
  }
  */
}

main().catch((err) => {
  console.error(err);
});