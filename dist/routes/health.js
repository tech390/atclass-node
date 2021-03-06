'use strict';

var _express = require('express');

var router = new _express.Router();

router.get('/', function (req, res) {

    res.set('Content-Type', 'text/plain');
    var status = req.app.get('HEALTH_STATUS');
    var response = {
        status: status + ' AtClass '
    };
    return res.send(response);
});

module.exports = router;
//# sourceMappingURL=health.js.map