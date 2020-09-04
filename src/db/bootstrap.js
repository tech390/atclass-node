import knex from './knex';
import {
    Log
} from '../utils';

export class Bootstrap {
    async run() {
        await this.runMigrations();

        // await knex.transaction(async function (trx) {
        //     const migrations = await trx.raw('select name from AtClass_knex_migrations');
        //     // Log.info('migrations', migrations);
        // });

    }

    async runMigrations() {
        try {
            Log.info('running migrations');
            // await knex.migrate.rollback(10);
            await knex.migrate.latest();
        } catch (err) {
            Log.error('running migrations failed.', err);
            throw err;
        }
    }

}

export const dbBootstrap = new Bootstrap();