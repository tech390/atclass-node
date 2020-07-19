'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.esService = exports.ESService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _esclient = require('../db/esclient');

var _services = require('../services');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ESService = function () {
    function ESService() {
        _classCallCheck(this, ESService);
    }

    _createClass(ESService, [{
        key: 'checkExistingDataIndex',
        value: async function checkExistingDataIndex(id, context, index, type) {

            var existingIndex = {};
            var indexBody = JSON.parse(JSON.stringify(context));
            try {
                existingIndex = await this.getESExists(index, type, id);
                if (existingIndex) {

                    var existingIndexData = await this.getESData(index, type, id);
                    if (existingIndexData) {
                        indexBody = {
                            id: id,
                            _source: existingIndexData._source
                        };
                    }
                }

                return indexBody;
            } catch (err) {
                _services.Log.child({
                    message: err.message,
                    stack: err.stack
                }).error('Error running checkExistingGridIndex. See Log.child.errorMessage.');

                return Promise.reject(err);
            }
        }
    }, {
        key: 'getESData',
        value: async function getESData(index, type, id) {
            try {
                var getIndexData = await _esclient.client.get({
                    index: index,
                    type: type,
                    id: id
                });
                return getIndexData;
            } catch (err) {
                _services.Log.child({
                    message: err.message,
                    stack: err.stack
                }).error('Error running getESData. See Log.child.errorMessage.');

                return Promise.reject(err);
            }
        }
    }, {
        key: 'getESExists',
        value: async function getESExists(index, type, id) {
            try {
                var existingIndex = await _esclient.client.exists({
                    index: index,
                    type: type,
                    id: id
                });
                return existingIndex;
            } catch (err) {
                _services.Log.child({
                    message: err.message,
                    stack: err.stack
                }).error('Error running getESExists. See Log.child.errorMessage.');

                return Promise.reject(err);
            }
        }
    }, {
        key: 'prepareIndexData',
        value: function prepareIndexData(index, type, id, body) {
            var data = {
                index: index,
                type: type,
                id: id,
                body: body
            };

            return data;
        }
    }, {
        key: 'indexDataArr',
        value: async function indexDataArr(_indexDataArr) {

            try {
                var results = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = _indexDataArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var indexData = _step.value;

                        results.push(this.indexData(indexData));
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
            } catch (err) {
                _services.Log.child({
                    message: err.message,
                    stack: err.stack
                }).error('Error running indexDataArr . See Log.child.errorMessage.');
            }
        }
    }, {
        key: 'indexData',
        value: async function indexData(_indexData) {

            try {
                if (Object.entries(_indexData).length === 0) {
                    return null;
                } else {
                    var result = await _esclient.client.index(_indexData);
                    return result;
                }
            } catch (err) {
                _services.Log.child({
                    message: err.message,
                    stack: err.stack
                }).error('Error running indexData for  ' + _indexData.index + ' and ' + _indexData.id + ' . See Log.child.errorMessage. ' + err);
                return {};
            }
        }
    }, {
        key: 'deleteIndex',
        value: async function deleteIndex(index) {
            try {
                var result = await _esclient.client.indices.delete({
                    index: index
                });
                return result;
            } catch (error) {
                throw error;
            }
        }
    }, {
        key: 'refreshIndex',
        value: async function refreshIndex(index) {
            var result = await _esclient.client.reindex(index);
            return result;
        }
    }, {
        key: 'bulkIndex',
        value: async function bulkIndex(bulkindexData) {
            try {
                var bulkResponse = await _esclient.client.bulk({
                    refresh: false,
                    body: bulkindexData
                });
                // console.log(JSON.stringify(bulkResponse, undefined, 2));
                if (bulkResponse.errors) {
                    var erroredDocuments = [];
                    bulkResponse.items.forEach(function (action, i) {
                        var operation = Object.keys(action)[0];
                        if (action[operation].error) {
                            erroredDocuments.push({
                                status: action[operation].status,
                                error: action[operation].error,
                                operation: bulkindexData[i * 2]
                            });
                        }
                    });
                    _services.Log.child({
                        erroredDocuments: erroredDocuments
                    }).error('AtClass: bulkIndex erroredDocuments');
                    return erroredDocuments;
                }
                return true;
            } catch (error) {
                _services.Log.child({
                    message: error.message,
                    stack: error.stack
                }).error('AtClass: Error in bulkIndex');
                return error;
            }
        }
    }, {
        key: 'search',
        value: async function search(index, body) {
            try {
                var data = await _esclient.client.search({
                    index: index,
                    body: body
                });
                return data;
            } catch (error) {
                _services.Log.child({
                    message: error.message,
                    stack: error.stack
                }).error('AtClass: Error in ES search');
                return error;
            }
        }
    }, {
        key: 'searchAndFilterHits',
        value: async function searchAndFilterHits(index, body) {
            try {
                var data = await _esclient.client.search({
                    index: index,
                    body: body
                });
                return data.hits.hits.map(function (x) {
                    return x._source;
                });
            } catch (error) {
                _services.Log.child({
                    message: error.message,
                    stack: error.stack
                }).error('AtClass: Error in ES search');
                return error;
            }
        }
    }, {
        key: 'getSchema',
        value: async function getSchema(index) {
            try {
                return await new Promise(function (resolve, reject) {
                    _esclient.client.indices.getMapping({
                        index: index
                    }, function (error, data) {
                        resolve(data);
                    });
                });
            } catch (error) {
                return error;
            }
        }
    }, {
        key: 'updateByQuery',
        value: async function updateByQuery(index, type, body) {
            try {
                return await _esclient.client.updateByQuery({
                    index: index,
                    type: type,
                    body: body
                });
            } catch (error) {
                return error;
            }
        }

        /**
         * Constructs all the given parameters needed to make a request to Elastic Search. 
         * @param {*} payload 
         */

    }]);

    return ESService;
}();

exports.ESService = ESService;

var esService = new ESService();
exports.esService = esService;
//# sourceMappingURL=esService.js.map