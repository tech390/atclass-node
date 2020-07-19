'use strict';

var _express = require('express');

var _elasticSearchService = require('../services/elasticSearchService');

var _knex = require('../db/knex');

var _knex2 = _interopRequireDefault(_knex);

var _redisHelper = require('../services/redisHelper');

var _log = require('../services/log');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express.Router();

router.get('/elasticsearch', function (req, res) {
    try {
        var _response = {
            status: 'AtClass elasticsearch db'
        };
        return res.send(_response);
    } catch (error) {
        _log.Log.info('Error - ', error);
        res.boom.badData(error);
    }
});

router.get('/redis', async function (req, res) {
    try {
        var _response2 = {
            status: 'AtClass redis-db'
        };
        await _redisHelper.redisHelper.hset('redis_test', 'sampleData', 'this data is from redis');
        var resp = await _redisHelper.redisHelper.getFields('redis_test', ['sampleData']);
        console.log('redis res', JSON.stringify(resp, undefined, 2));
        return res.send({ response: _response2, resp: resp });
    } catch (error) {
        _log.Log.info('Error - ', error);
        res.boom.badData(error);
    }
});

router.get('/mysql', async function (req, res) {
    try {
        var _response3 = {
            status: 'AtClass mysql bd'
        };
        var resp = await _knex2.default.select('PersonalDetails', 'Name', 'HasJob').from('mysql_metadata');
        console.log('mysql res', JSON.stringify(resp, undefined, 2));
        return res.send({ response: _response3, resp: resp });
    } catch (error) {
        _log.Log.info('Error - ', error);
        res.boom.badData(error);
    }
});

router.post('/elasticsearch/query', async function (req, res) {
    try {
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
    } catch (error) {
        _log.Log.info('Error - ', error);
        res.boom.badData(error);
    }
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