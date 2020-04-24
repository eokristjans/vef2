// A beaute learned from Olafur Sverrir Kjartansson

const { isEmpty } = require('./validation');

module.exports =

/**
 * Checks which variables in vars are missing from process.env,
 * if any, then prints them in console.error() and exits the program.
 *
 * @param {array} vars Variables to check for in process.env
 */
function requireEnv(vars = []) {
  const missing = [];

  vars.forEach((v) => {
    if (!process.env[v] || isEmpty(process.env[v])) {
      missing.push(v);
    }
  });

  if (missing.length > 0) {
    console.error(`${missing.join(', ')} vantar í umhverfi`);
    process.exit(1);
  }
};
