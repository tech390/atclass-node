import {
    Log
} from './log';
import JwtDecode from 'jwt-decode';
import jwt from 'jsonwebtoken';


const auth = (req, res, next) => {
    try {
        next();
    } catch (error) {
        Log.info('Error in auth middleware ', error);
    }
};

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if (bearerHeader) {
        let token = bearerHeader.split(' ')[1];
        // get secretKey that user from redis
        let secretKey = 'ea44f423-9e55-4dc2-89c1-aaa3fa0dc24c';
        jwt.verify(token, secretKey, (err, authData) => {
            if (err) {
                res.boom.badRequest('unauthorized')
            } else {
                console.log('authData ------------->', authData);
                next();
            }
        })
    } else {
        res.boom.badRequest('unauthorized')
    }
}

const unless = (path, middleware) => {
    return function (req, res, next) {
        if (path.includes(req.path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

export {
    auth, verifyToken, unless
};