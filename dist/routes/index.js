'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _services = require('../services');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Router = exports.Router = {
    build: function build(app) {
        var _this = this;

        var routes = _fs2.default.readdirSync(__dirname).filter(function (file) {
            return file !== 'index.js';
        }).filter(function (file) {
            return file.match(/^(?!.*\.test\.js$).*\.js$/);
        }).map(function (file) {
            return file.split('.')[0];
        });

        routes.forEach(function (route) {
            app.use('/' + route, _this.importSubRouter('./' + route + '.js'));
            // let temp = this.importSubRouter(`./${route}.js`);
            // Log.info(temp);
            // app.use(`/${route}`, temp);
        });
    },
    importSubRouter: function importSubRouter(filePath) {
        return require(filePath);
    }
};
//# sourceMappingURL=index.js.map