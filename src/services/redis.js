import redis from 'redis';
import {
    Log
} from './log';

export const validateHost = pHost => {
    if (!pHost) {
        throw Error(`REDIS_HOST is invalid. ${pHost}`);
    }
    Log.info(`REDIS HOST: ${pHost}`);
};

export const host = process.env.REDIS_HOST;
validateHost(host);
export const port = process.env.REDIS_PORT;
if (!port) {
    throw Error(`REDIS_PORT is invalid. ${port}`);
}

const redisClient = redis.createClient(port, host, {
    password: process.env.REDIS_AUTH,
    tls: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? '' : {
        checkServerIdentity: () => undefined
    }
});

redisClient.on('connect', () => {
    Log.info('REDIS CONNECTION STATUS SUCCESS');
});

redisClient.on('error', err => {
    Log.info(`REDIS CONNECTION STATUS FAILED : ${err.message}`);
});

export {
    redisClient
};