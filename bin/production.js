console.log('Running In production ---------------------:)')

require('babel-register')
require("babel-polyfill");
require('../dist/index.js')