'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bookshelf = require('../../bookshelf.config');

var _bookshelf2 = _interopRequireDefault(_bookshelf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var backendmysqlData = _bookshelf2.default.Model.extend({
    tableName: 'mysql_metadata',
    idAttribute: 'mysql_guid',
    uuid: true,
    hasTimestamps: ['created_date']
}, {
    jsonColumns: ['PersonalDetails'],
    upsert: async function upsert(upsertData) {
        if (!upsertData) {
            throw new Error('Invalid upsert object');
        }
        var existingModel = await this.query({
            where: {
                ID: upsertData.ID,
                Name: upsertData.Name
            }
        }).fetch();
        if (existingModel) {
            await existingModel.set(upsertData).save(null, { method: 'update' });
        } else {
            await new this(upsertData).save({}, { method: 'insert' });
        }
        return true;
    }
});

exports.default = backendmysqlData;
//# sourceMappingURL=index.js.map