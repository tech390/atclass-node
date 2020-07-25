import {
    Log
} from './log';
import { esService } from './esService';

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

}
const elasticSearchService = new ElasticSearchService();
export {
    elasticSearchService
};