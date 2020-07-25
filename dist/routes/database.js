'use strict';

var _express = require('express');

var _elasticSearchService = require('../services/elasticSearchService');

var _knex = require('../db/knex');

var _knex2 = _interopRequireDefault(_knex);

var _redisHelper = require('../services/redisHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express.Router();

router.get('/elasticsearch', function (req, res) {
    var response = {
        status: 'AtClass elasticsearch db'
    };
    return res.send(response);
});

router.get('/redis', async function (req, res) {
    var response = {
        status: 'AtClass redis-db'
    };
    await _redisHelper.redisHelper.hset('redis_test', 'sampleData', 'this data is from redis');
    var resp = await _redisHelper.redisHelper.getFields('redis_test', ['sampleData']);
    console.log('redis res', JSON.stringify(resp, undefined, 2));
    return res.send({ response: response, resp: resp });
});

router.get('/mysql', async function (req, res) {
    var response = {
        status: 'AtClass mysql bd'
    };
    var resp = await _knex2.default.select('PersonalDetails', 'Name', 'HasJob').from('mysql_metadata');
    console.log('mysql res', JSON.stringify(resp, undefined, 2));
    return res.send({ response: response, resp: resp });
});

router.post('/elasticsearch/query', async function (req, res) {
    var payload = req.body;
    var mapping = void 0;
    var atClassQueryRes = await _elasticSearchService.elasticSearchService.query(payload.index, payload.query);
    if (payload.isSchemaRequired) {
        mapping = await _elasticSearchService.elasticSearchService.getSchema(payload.index);
    }
    if (payload.filterHits) {
        atClassQueryRes = atClassQueryRes.hits.hits.map(function (x) {
            return x._source;
        });
    }
    res.send({
        atClassQueryRes: atClassQueryRes,
        mapping: mapping
    });
});

router.delete('elasticsearch/deleteindex', async function (req, res) {
    var result;
    try {
        result = await _elasticSearchService.elasticSearchService.deleteIndex(req.body.index);
        res.send({
            result: result
        });
    } catch (error) {
        res.boom.badData(error);
    }
});

module.exports = router;
//# sourceMappingURL=database.js.map