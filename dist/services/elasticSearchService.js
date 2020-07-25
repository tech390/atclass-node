'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.elasticSearchService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log = require('./log');

var _esService = require('./esService');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ElasticSearchService = function () {
    function ElasticSearchService() {
        _classCallCheck(this, ElasticSearchService);
    }

    _createClass(ElasticSearchService, [{
        key: 'query',
        value: function query(index, _query) {
            return _esService.esService.search(index, _query);
        }
    }, {
        key: 'getSchema',
        value: async function getSchema(index) {
            var data = await _esService.esService.getSchema(index);
            return data;
        }
    }, {
        key: 'deleteIndex',
        value: function deleteIndex(index) {
            return _esService.esService.deleteIndex(index);
        }
    }]);

    return ElasticSearchService;
}();

var elasticSearchService = new ElasticSearchService();
exports.elasticSearchService = elasticSearchService;
//# sourceMappingURL=elasticSearchService.js.map