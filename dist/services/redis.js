'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.redisClient = exports.port = exports.host = exports.validateHost = undefined;

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _log = require('./log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateHost = exports.validateHost = function validateHost(pHost) {
    if (!pHost) {
        throw Error('REDIS_HOST is invalid. ' + pHost);
    }
    _log.Log.info('REDIS HOST: ' + pHost);
};

var host = exports.host = process.env.REDIS_HOST;
validateHost(host);
var port = exports.port = process.env.REDIS_PORT;
if (!port) {
    throw Error('REDIS_PORT is invalid. ' + port);
}

var redisClient = _redis2.default.createClient(port, host, {
    password: process.env.REDIS_AUTH,
    tls: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? '' : {
        checkServerIdentity: function checkServerIdentity() {
            return undefined;
        }
    }
});

redisClient.on('connect', function () {
    _log.Log.info('REDIS CONNECTION STATUS SUCCESS');
});

redisClient.on('error', function (err) {
    _log.Log.info('REDIS CONNECTION STATUS FAILED : ' + err.message);
});

exports.redisClient = redisClient;
//# sourceMappingURL=redis.js.map