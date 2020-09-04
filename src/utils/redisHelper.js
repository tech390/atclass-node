import { redisClient } from './redis';
class RedisHelper {
    getAll(key) {
        return new Promise((resolve, reject) => {
            redisClient.hgetall(key, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }
    getFields(key, fields) {
        return new Promise((resolve, reject) => {
            redisClient.hmget(key, ...fields, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }
    get(key) {
        return new Promise((resolve, reject) => {
            redisClient.get(key, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }
    set(key, value) {
        return new Promise((resolve, reject) => {
            redisClient.set(key, value, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }
    hset(key, field, value) {
        return new Promise((resolve, reject) => {
            redisClient.hset(key, field, value, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }
    setMany(key, values) {
        return new Promise((resolve, reject) => {
            redisClient.hmset(key, ...values, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }
    delete(key) {
        return new Promise((resolve, reject) => {
            redisClient.del(key, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }
}

const redisHelper = new RedisHelper();

export {
    redisHelper
};