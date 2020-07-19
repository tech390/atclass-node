'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.auth = undefined;

var _log = require('./log');

var _jwtDecode = require('jwt-decode');

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var auth = function auth(req, res, next) {
    try {
        console.log('=========== header  >>>>>>>>>', req.headers);
        next();
    } catch (error) {
        _log.Log.info('Error in auth middleware ', error);
    }
};

exports.auth = auth;
//# sourceMappingURL=authMiddlewares.js.map