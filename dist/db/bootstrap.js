'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dbBootstrap = exports.Bootstrap = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _knex = require('./knex');

var _knex2 = _interopRequireDefault(_knex);

var _services = require('../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bootstrap = exports.Bootstrap = function () {
    function Bootstrap() {
        _classCallCheck(this, Bootstrap);
    }

    _createClass(Bootstrap, [{
        key: 'run',
        value: async function run() {
            await this.runMigrations();

            // await knex.transaction(async function (trx) {
            //     const migrations = await trx.raw('select name from AtClass_knex_migrations');
            //     // Log.info('migrations', migrations);
            // });
        }
    }, {
        key: 'runMigrations',
        value: async function runMigrations() {
            try {
                _services.Log.info('running migrations');
                // await knex.migrate.rollback(10);
                await _knex2.default.migrate.latest();
            } catch (err) {
                _services.Log.error('running migrations failed.', err);
                throw err;
            }
        }
    }]);

    return Bootstrap;
}();

var dbBootstrap = exports.dbBootstrap = new Bootstrap();
//# sourceMappingURL=bootstrap.js.map