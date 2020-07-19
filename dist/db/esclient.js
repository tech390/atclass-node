'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.client = undefined;

var _esconfig = require('./esconfig');

var _elasticsearch = require('elasticsearch');

var _elasticsearch2 = _interopRequireDefault(_elasticsearch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = new _elasticsearch2.default.Client(_esconfig.connection);
exports.client = client;
//# sourceMappingURL=esclient.js.map