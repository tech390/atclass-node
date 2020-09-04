import {
    Log
} from '../utils/log';
import { esService } from '../utils/esService';
import { v4 as uuidv4 } from 'uuid';

class ElasticSearchService {

    query(index, query) {
        try {
            return esService.search(index, query);
        } catch (error) {
            Log.info('Error - ', error);
        }
    }

    async getSchema(index) {
        try {
            const data = await esService.getSchema(index);
            return data;
        } catch (error) {
            Log.info('Error - ', error);
        }
    }

    deleteIndex(index) {
        try {
            return esService.deleteIndex(index);
        } catch (error) {
            Log.info('Error - ', error);
        }
    }
    bulkIndexData(data, index, type) {
        try {
            let bulkDataArr = [];
            data.forEach(row => {
                let obj = {
                    'index': {
                        '_index': index,
                        '_type': type,
                        '_id': uuidv4()
                    }
                };
                bulkDataArr.push(obj);
                bulkDataArr.push(row);
            });
            return esService.bulkIndex(bulkDataArr);
        } catch (error) {
            Log.info('Error - ', error);
        }
    }
}

const elasticSearchService = new ElasticSearchService();
export {
    elasticSearchService
};