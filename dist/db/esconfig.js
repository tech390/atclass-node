'use strict';

var esHost = process.env.ES_PROTO + '://' + process.env.ES_HOST + ':' + process.env.ES_PORT;
module.exports = {
    connection: {
        host: esHost,
        log: 'warning',
        requestTimeout: Infinity,
        apiVersion: '6.8'
    }
};
//# sourceMappingURL=esconfig.js.map