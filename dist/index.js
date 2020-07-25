'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Server = exports.backendService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressBoom = require('express-boom');

var _expressBoom2 = _interopRequireDefault(_expressBoom);

var _routes = require('./routes');

var _services = require('./services');

var _db = require('./db');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _authMiddlewares = require('./services/authMiddlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('dotenv').config();
var process = require('process');

var backendService = exports.backendService = function () {
    function backendService() {
        var dbBootstraped = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var esMigrated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, backendService);

        this.dbBootstraped = false;
        this.esMigrated = false;
    }

    _createClass(backendService, [{
        key: 'createApp',
        value: function createApp() {
            var app = (0, _express2.default)();
            app.set('HEALTH_STATUS', 'INITIALIZING');
            app.use(_bodyParser2.default.json());
            app.use((0, _expressBoom2.default)());
            app.use(_services.LogMiddleware);
            app.use((0, _cors2.default)());
            app.use((0, _authMiddlewares.auth)());
            _routes.Router.build(app);

            return app;
        }
    }, {
        key: 'initDB',
        value: async function initDB() {
            try {
                _services.Log.info('Initializing dbBootstrap');
                await _db.dbBootstrap.run();
                _services.Log.info('dbBootstrap sucessful and migrations ran');
                this.dbBootstraped = true;
            } catch (e) {
                _services.Log.child({
                    message: e.message,
                    stack: e.stack
                }).error('Error bootstraping the database.');
                this.app.set('HEALTH_STATUS', 'DB_MIGRATION_FAILED');
                return Promise.reject(e);
            }
        }
    }, {
        key: 'initESMigrations',
        value: async function initESMigrations() {
            try {
                _services.Log.info('Initializing initESMigrations');
                await _db.esMigrations.run();
                this.esMigrated = true;
                _services.Log.info('Completed initESMigrations');
            } catch (e) {
                _services.Log.child({
                    message: e.message,
                    stack: e.stack
                }).error('Error bootstraping the eSMigrations.');
                this.app.set('HEALTH_STATUS', 'ES_MIGRATION_FAILED');
                return Promise.reject(e);
            }
        }
    }, {
        key: 'init',
        value: function init() {
            _services.Log.info('Initializing AtClass-app');
            this.app = this.createApp();
            var _process$env = process.env,
                PORT = _process$env.PORT,
                NODE_environment = _process$env.NODE_environment;

            // ENV Argument Checks

            if (!PORT || !NODE_environment) {
                var msg = 'Configuration Error: you must specify these ENV variables: PORT, NODE_environment';
                _services.Log.error(msg);
                throw new Error(msg);
            }

            this.port = PORT;
            this.env = NODE_environment;
        }
    }, {
        key: 'start',
        value: async function start() {
            var _this = this;

            this.init();
            var DOCKER_HOST = '0.0.0.0';

            var server = this.app.listen(this.port, DOCKER_HOST, function (err) {
                if (err) {
                    _this.app.set('HEALTH_STATUS', 'SERVER_LISTEN_FAILED');
                    throw err;
                }

                _services.Log.info('Server started on http://' + DOCKER_HOST + ':' + _this.port);
            });

            await this.waitFnc();

            if (!this.dbBootstraped) {
                await this.initDB();
            }

            if (!this.esMigrated) {
                await this.initESMigrations();
            }
            if (this.env === 'development' || this.env === 'testing' || this.env === 'test') {
                process.env.isAppReadyForTest = true;
            }

            this.app.set('HEALTH_STATUS', 'READY');
            _services.Log.info('Initialization successful. Service is Ready.');

            // Shutdown Hook
            process.on('SIGTERM', function () {
                _this.stop(server);
            });
            process.on('unhandledRejection', function (e) {
                _services.Log.child({
                    message: e.message,
                    stack: e.stack
                }).error('Error due to unhandledRejection.');
            });
            return Promise.resolve();
        }
    }, {
        key: 'waitFnc',
        value: function waitFnc() {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    console.log('waiting for 3 sec');
                    resolve("3 sec");
                }, 3000);
            });
        }
    }, {
        key: 'stop',
        value: function stop(server) {
            _services.Log.info('Starting graceful shutdown...');
            this.app.set('HEALTH_STATUS', 'SHUTTING_DOWN');

            //LoadingDock.readShutdown();

            setTimeout(function () {
                server.close(function () {
                    _services.Log.info('Shutdown Complete.');
                    process.exit(0);
                });
            }, 3000);
        }
    }]);

    return backendService;
}();

var Server = exports.Server = new backendService();
// Start the service when run from command line
if (process.env.NODE_environment === 'production' || process.env.NODE_environment === 'development') {
    _services.Log.info('AtClass-app: Server started');
    Server.start();
} else {
    _services.Log.error('AtClass-app: Server not started.');
}
//# sourceMappingURL=index.js.map