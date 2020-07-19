'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.redisHelper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redis = require('./redis');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RedisHelper = function () {
    function RedisHelper() {
        _classCallCheck(this, RedisHelper);
    }

    _createClass(RedisHelper, [{
        key: 'getAll',
        value: function getAll(key) {
            return new Promise(function (resolve, reject) {
                _redis.redisClient.hgetall(key, function (error, data) {
                    error ? reject(error) : resolve(data);
                });
            });
        }
    }, {
        key: 'getFields',
        value: function getFields(key, fields) {
            return new Promise(function (resolve, reject) {
                _redis.redisClient.hmget.apply(_redis.redisClient, [key].concat(_toConsumableArray(fields), [function (error, data) {
                    error ? reject(error) : resolve(data);
                }]));
            });
        }
    }, {
        key: 'get',
        value: function get(key) {
            return new Promise(function (resolve, reject) {
                _redis.redisClient.get(key, function (error, data) {
                    error ? reject(error) : resolve(data);
                });
            });
        }
    }, {
        key: 'set',
        value: function set(key, value) {
            return new Promise(function (resolve, reject) {
                _redis.redisClient.set(key, value, function (error, data) {
                    error ? reject(error) : resolve(data);
                });
            });
        }
    }, {
        key: 'hset',
        value: function hset(key, field, value) {
            return new Promise(function (resolve, reject) {
                _redis.redisClient.hset(key, field, value, function (error, data) {
                    error ? reject(error) : resolve(data);
                });
            });
        }
    }, {
        key: 'setMany',
        value: function setMany(key, values) {
            return new Promise(function (resolve, reject) {
                _redis.redisClient.hmset.apply(_redis.redisClient, [key].concat(_toConsumableArray(values), [function (error, data) {
                    error ? reject(error) : resolve(data);
                }]));
            });
        }
    }, {
        key: 'delete',
        value: function _delete(key) {
            return new Promise(function (resolve, reject) {
                _redis.redisClient.del(key, function (error, data) {
                    error ? reject(error) : resolve(data);
                });
            });
        }
    }]);

    return RedisHelper;
}();

var redisHelper = new RedisHelper();

exports.redisHelper = redisHelper;
//# sourceMappingURL=redisHelper.js.map