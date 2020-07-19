import {
    Log
} from './log';
import JwtDecode from 'jwt-decode';


const auth = (req, res, next) => {
    try {
        console.log('=========== header  >>>>>>>>>', req.headers);
        next();
    } catch (error) {
        Log.info('Error in auth middleware ', error);
    }
};

export {
    auth,
};