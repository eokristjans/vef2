/*
Gerði
  npm install --save-dev @babel/core @babel/cli @babel/preset-env
  npm install --save @babel/polyfill

Nú á að vera hægt að keyra eftirfarandi skipun
og þá verður til babel þýðing af .js skránnum okkar
í möppunni dist:
  npm run babel

En það er betra að keyra bara
  npm run rollup
því babel er inní því
*/


import babel from 'rollup-plugin-babel';

module.exports = {
  input: './src/index.js',
  output: {
    file: './dist/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      sourceMaps: true,
      presets: [
        ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
      ],
    }),
  ],
};
