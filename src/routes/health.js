import {
    Router,
    response
} from 'express';
const router = new Router();

router.get('/', (req, res) => {
    try {
        res.set('Content-Type', 'text/plain');
        const status = req.app.get('HEALTH_STATUS');
        let response = {
            status: `${status} AtClass `
        }
        return res.send(response);
    } catch (error) {
        Log.info('Error - ', error);
        res.boom.badData(error);
    }

});

module.exports = router;