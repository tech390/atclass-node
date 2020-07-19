'use strict';

var _express = require('express');

var router = new _express.Router();

router.get('/', function (req, res) {
    try {
        res.set('Content-Type', 'text/plain');
        var status = req.app.get('HEALTH_STATUS');
        var _response = {
            status: status + ' AtClass '
        };
        return res.send(_response);
    } catch (error) {
        Log.info('Error - ', error);
        res.boom.badData(error);
    }
});

module.exports = router;
//# sourceMappingURL=health.js.map