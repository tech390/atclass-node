import {
    Router,
    response
} from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userCredentials } from '../services/userCredentials';
import { redisHelper } from '../utils/redisHelper';
import Joi from '@hapi/joi';
import { Log } from '../utils/log';
const router = new Router();

router.get('/', async (req, res) => {
    try {

    } catch (error) {
        Log.info('Error - ', error);
        res.boom.badData(error);
    }
});


module.exports = router;