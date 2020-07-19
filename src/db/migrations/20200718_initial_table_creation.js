import {
    BaseMigration
} from './base/baseMigrations';
import {
    Log
} from '../../services/log';

exports.up = async function up(knex, Promise) {
    let tableExists = await knex.schema.hasTable('mysql_metadata');
    if (!tableExists) {
        await knex.schema.createTable('mysql_metadata', table => {
            table.uuid('mysql_guid').primary();
            table.integer('ID', 200);
            table.string('Name', 200);
            table.string('Role', 200);
            table.boolean('HasJob');
            table.specificType('PersonalDetails', 'JSON');
            table.dateTime('created_date').defaultTo(knex.fn.now());
            table.dateTime('modified_date');
            table.dateTime('deleted_date');
            table.unique(['ID', 'Name']);
        });
    }

    const getBaseMigration = new BaseMigration();
    const res = await getBaseMigration.upsertMetaData();
    if (res) {
        Log.info('migration done and data inserted');
    }

    return Promise.resolve(true);
};

exports.down = function down(knex, Promise) {
    return Promise.resolve(true);
};
