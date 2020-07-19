require('babel-register');
require("babel-polyfill");

require('./src/index.js')


// const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// if (env === 'production') {
//   module.export = require('./dist/');
// } else {
//   require('@babel/register');
//   module.export = require('./src');
// }
