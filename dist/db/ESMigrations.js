'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.esMigrations = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _services = require('../services');

var _esclient = require('./esclient');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ESMigrations = function () {
    function ESMigrations() {
        _classCallCheck(this, ESMigrations);
    }

    _createClass(ESMigrations, [{
        key: 'run',
        value: async function run() {
            var currentFileName = null;
            try {
                var esIndices = _fs2.default.readdirSync(_path2.default.join(__dirname, '/es_migrations/')).filter(function (file) {
                    return file !== 'index.js';
                });

                var esIndicesData = {};
                esIndices.forEach(function (filename) {
                    currentFileName = filename;
                    var content = _fs2.default.readFileSync(_path2.default.join(__dirname, '/es_migrations/', filename));
                    esIndicesData[filename.split('.')[0]] = JSON.parse(content);
                });
                return await this.processMigrations(esIndicesData);
            } catch (err) {
                _services.Log.info('Error running ES Migrarions for ' + currentFileName + '. See Log.child.errorMessage ');
                _services.Log.child({
                    message: err.message,
                    stack: err.stack
                }).info('Error running ES Migrarions for ' + currentFileName + '. See Log.child.errorMessage.');
                return err;
            }
        }
    }, {
        key: 'processMigrations',
        value: async function processMigrations(esIndicesData) {
            var results = [];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(esIndicesData)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _slicedToArray(_step.value, 2),
                        key = _step$value[0],
                        value = _step$value[1];

                    results.push(this.runMigrations(key, value));
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

            await Promise.all(results);
            return true;
        }
    }, {
        key: 'runMigrations',
        value: async function runMigrations(esIndexName, esIndiceBody) {
            var indexExists = void 0;
            try {
                indexExists = await _esclient.client.indices.exists({
                    index: esIndexName
                });
                if (!indexExists) {
                    _services.Log.info('New Index ' + esIndexName);
                    return await _esclient.client.indices.create({
                        index: esIndexName,
                        body: esIndiceBody
                    });
                }
            } catch (err) {
                _services.Log.child({
                    message: err.message,
                    stack: err.stack
                }).info('Error running ES Migrarions for ' + esIndexName + ' and update  ' + indexExists + '. See Log.child.errorMessage.');
                return err;
            }
        }
    }]);

    return ESMigrations;
}();

var esMigrations = exports.esMigrations = new ESMigrations();
//# sourceMappingURL=ESMigrations.js.map