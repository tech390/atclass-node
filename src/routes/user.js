import {
    Router,
    response
} from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { userCredentials } from '../services/userCredentials';
import { redisHelper } from '../services/redisHelper';
import Joi from '@hapi/joi';
import { Log } from '../services/log';
const router = new Router();

router.post('/login', async (req, res) => {
    const schema = {
        password: Joi.string().required(),
        userName: Joi.string(),
        mobileNumber: Joi.number().integer(),
        mailID: Joi.string()
    };

    const userLoginCredentials = req.body;
    const result = Joi.validate(userLoginCredentials, schema);
    if (result.error) {
        Log.info(' Error encountered at  joi validation');
        return res.boom.badData(result.error);
    }
    try {
        let user = await userCredentials.validUser(userLoginCredentials);
        console.log(JSON.stringify(user, undefined, 2));

        if (user.validUser) {
            let date, sessionId, timestamp, secretKey;
            date = new Date();
            timestamp = date.getTime();
            sessionId = `${user.userDetails.mailID.split('@')[0]}-${user.userDetails.userName}-${timestamp}`
            // secretKey = uuidv4();
            secretKey = 'ea44f423-9e55-4dc2-89c1-aaa3fa0dc24c';
            let token = jwt.sign({ sessionId: sessionId, mailID: user.userDetails.mailID }, secretKey, { expiresIn: '6h' });
            // secretToken = {
            //     secretKey,
            //     token,
            //     timestamp
            // };
            // await redisHelper.hset('UserSessionSecret', user.userDetails.mailID, JSON.stringify(secretToken));
            let response = { message: 'login successful', token: `Bearer ${token}` };
            return res.send(response);
        } else {
            res.send('Incorrect Password or Mail');
        }
    } catch (error) {
        Log.info('Error - ', error);
        res.boom.badData(error);
    }
});

router.post('/register', async (req, res) => {
    const schema = {
        userName: Joi.string(),
        mailID: Joi.string(),
        mobileNumber: Joi.number().integer(),
        age: Joi.number().integer(),
        class: Joi.string(),
        university: Joi.string(),
        college: Joi.string(),
        school: Joi.string(),
        sex: Joi.string(),
        branch: Joi.string(),
        yearOfPassOut: Joi.number().integer(),
        StudyGroup: Joi.string(),
        degree: Joi.string(),
        password: Joi.string(),
        rollNumber: Joi.string(),
        bio: Joi.string(),
        dateOfbirth: Joi.date().iso(),
        registeredDate: Joi.date().iso(),
        instituteLocation: Joi.string(),
        residenceLocation: Joi.string()
    };

    const userLoginCredentials = req.body;
    const result = Joi.validate(userLoginCredentials, schema);
    if (result.error) {
        Log.info(' Error encountered at  joi validation');
        return res.boom.badData(result.error);
    }
    try {
        const userRegisterCredentials = req.body;
        let response = await userCredentials.isCredentialsUnique(userRegisterCredentials);
        return res.send(response);
    } catch (error) {
        Log.info('Error while registering new user - ', error);
        res.boom.badData(error);
    }
})

// router.post('/changepassword', async (req, res) => {

// })

// router.post('/forgotpassword', async (req, res) => {
// })

module.exports = router;