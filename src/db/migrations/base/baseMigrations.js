import {
    Log
} from '../../../services/log';
import backendmysqlData from '../../models/backend-mysqlData';
import jsonfile from 'jsonfile';
import path from 'path';
export class BaseMigration {

    upsertMetaData() {
        return new Promise(async (resolve, reject) => {
            const data = jsonfile.readFileSync(path.join(__dirname, '../../../../Data/sampleData/MysqlData/test/data.json'));
            try {
                for (const element of data) {
                    await backendmysqlData.upsert(element);
                    Log.info('upserting data', element);
                }
                resolve(true);
            } catch (ex) {
                Log.error('Upsert Data   --> Exception -->', ex.message, ex);
                reject(ex);
            }
        });
    }

}