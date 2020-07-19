'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Log = exports.LogMiddleware = undefined;

var _expressPinoLogger = require('express-pino-logger');

var _expressPinoLogger2 = _interopRequireDefault(_expressPinoLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Add Middlewares
var LogMiddleware = (0, _expressPinoLogger2.default)({
    name: 'AtClass'
});

var Log = LogMiddleware.logger;

exports.LogMiddleware = LogMiddleware;
exports.Log = Log;
//# sourceMappingURL=log.js.map