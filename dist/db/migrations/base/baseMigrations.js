'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseMigration = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log = require('../../../services/log');

var _backendMysqlData = require('../../models/backend-mysqlData');

var _backendMysqlData2 = _interopRequireDefault(_backendMysqlData);

var _jsonfile = require('jsonfile');

var _jsonfile2 = _interopRequireDefault(_jsonfile);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseMigration = exports.BaseMigration = function () {
    function BaseMigration() {
        _classCallCheck(this, BaseMigration);
    }

    _createClass(BaseMigration, [{
        key: 'upsertMetaData',
        value: function upsertMetaData() {
            return new Promise(async function (resolve, reject) {
                var data = _jsonfile2.default.readFileSync(_path2.default.join(__dirname, '../../../../Data/sampleData/MysqlData/test/data.json'));
                try {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var element = _step.value;

                            await _backendMysqlData2.default.upsert(element);
                            _log.Log.info('upserting data', element);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    resolve(true);
                } catch (ex) {
                    _log.Log.error('Upsert Data   --> Exception -->', ex.message, ex);
                    reject(ex);
                }
            });
        }
    }]);

    return BaseMigration;
}();
//# sourceMappingURL=baseMigrations.js.map