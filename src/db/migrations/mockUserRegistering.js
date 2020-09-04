import {
    Log
} from '../../utils/log';
import jsonfile from 'jsonfile';
import path from 'path';
import fs from 'fs';
import { elasticSearchService } from '../../services/elasticSearchService';

exports.up = async function up(knex, Promise) {
    try {
        Log.info('AtCLass: registering default users');
        const filePath = path.join(__dirname, '/../../../Data/sampleData/elasticSearch/user.json');
        if (fs.existsSync(filePath)) {
            let data = jsonfile.readFileSync(filePath);
            let type = 'usercredentials', index = 'atclass-usercredentials';
            const bulkIndexRes = await elasticSearchService.bulkIndexData(data, index, type);
            Log.info('AtCLass: data index Done', bulkIndexRes);
        }
        Log.info('AtCLass: registering default users completed');
        return Promise.resolve(true);
    } catch (error) {
        Log.info('Error running Migrarions for registering default users See Log.child.errorMessage ');
        Log.child({ message: error.message, stack: error.stack }).info('Error running for Migrarions. See Log.child.errorMessage.');
    }
};

exports.down = function down(knex, Promise) {
    return Promise.resolve(true);
};
