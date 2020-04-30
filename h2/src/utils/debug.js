// A beaute learned from Olafur Sverrir Kjartansson

const {
  DEBUG = true,
} = process.env;

/**
 * Prints debug messages m in console.info()
 *
 * @param  {...any} m message(s) to print in console.info()
 */
function debug(...m) {
  if (DEBUG) {
    console.info(...m);
  }
}

module.exports = {
  debug,
};
