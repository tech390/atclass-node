import {
    Router,
    response
} from 'express';
import {
    elasticSearchService
} from '../services/elasticSearchService';
import knex from '../db/knex';
import { redisHelper } from '../utils/redisHelper';
import { Log } from '../utils/log'


const router = new Router();

router.get('/redis', async (req, res) => {
    try {
        let response = {
            status: 'AtClass redis-db'
        };
        await redisHelper.hset('redis_test', 'sampleData', 'this data is from redis');
        let resp = await redisHelper.getFields('redis_test', ['sampleData']);
        console.log('redis res', JSON.stringify(resp, undefined, 2));
        return res.send({ response, resp });
    } catch (error) {
        Log.info('Error - ', error);
        res.boom.badData(error);
    }
});

router.get('/mysql', async (req, res) => {
    try {
        let response = {
            status: 'AtClass mysql bd'
        }
        let resp = await knex.select('PersonalDetails', 'Name', 'HasJob').from('mysql_metadata');
        console.log('mysql res', JSON.stringify(resp, undefined, 2));
        return res.send({ response, resp });
    } catch (error) {
        Log.info('Error - ', error);
        res.boom.badData(error);
    }
});


router.post('/elasticsearch/query', async (req, res) => {
    try {
        const payload = req.body;
        let mapping;
        let atClassQueryRes = await elasticSearchService.query(payload.index, payload.query);
        if (payload.isSchemaRequired) {
            mapping = await elasticSearchService.getSchema(payload.index);
        }
        if (payload.filterHits) {
            atClassQueryRes = atClassQueryRes.hits.hits.map(x => x._source);
        }
        res.send({
            atClassQueryRes,
            mapping
        });
    } catch (error) {
        Log.info('Error - ', error);
        res.boom.badData(error);
    }
});

router.delete('elasticsearch/deleteindex', async (req, res) => {
    var result;
    try {
        result = await elasticSearchService.deleteIndex(req.body.index);
        res.send({
            result
        });
    } catch (error) {
        res.boom.badData(error);
    }
});


module.exports = router;