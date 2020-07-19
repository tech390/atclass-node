'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _knexfile = require('./knexfile');

var knexfile = _interopRequireWildcard(_knexfile);

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = (0, _knex2.default)(knexfile);
//# sourceMappingURL=knex.js.map