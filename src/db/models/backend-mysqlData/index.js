import Bookshelf from '../../bookshelf.config';

const backendmysqlData = Bookshelf.Model.extend({
    tableName: 'mysql_metadata',
    idAttribute: 'mysql_guid',
    uuid: true,
    hasTimestamps: ['created_date']
}, {
    jsonColumns: ['PersonalDetails'],
    async upsert(upsertData) {
        if (!upsertData) {
            throw new Error('Invalid upsert object');
        }
        const existingModel = await this.query({
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

export default backendmysqlData;
