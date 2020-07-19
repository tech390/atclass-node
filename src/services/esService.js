import { client } from '../db/esclient';
import {
    Log
} from '../services';

export class ESService {

    async checkExistingDataIndex(id, context, index, type) {

        let existingIndex = {};
        let indexBody = JSON.parse(JSON.stringify(context));
        try {
            existingIndex = await this.getESExists(index, type, id);
            if (existingIndex) {

                const existingIndexData = await this.getESData(index, type, id);
                if (existingIndexData) {
                    indexBody = {
                        id: id,
                        _source: existingIndexData._source
                    };
                }
            }

            return indexBody;
        } catch (err) {
            Log.child({
                message: err.message,
                stack: err.stack
            }).error('Error running checkExistingGridIndex. See Log.child.errorMessage.');

            return Promise.reject(err);
        }
    }

    async getESData(index, type, id) {
        try {
            const getIndexData = await client.get({
                index: index,
                type: type,
                id: id
            });
            return getIndexData;

        } catch (err) {
            Log.child({
                message: err.message,
                stack: err.stack
            }).error('Error running getESData. See Log.child.errorMessage.');


            return Promise.reject(err);
        }
    }

    async getESExists(index, type, id) {
        try {
            const existingIndex = await client.exists({
                index: index,
                type: type,
                id: id
            });
            return existingIndex;

        } catch (err) {
            Log.child({
                message: err.message,
                stack: err.stack
            }).error('Error running getESExists. See Log.child.errorMessage.');

            return Promise.reject(err);
        }
    }

    prepareIndexData(index, type, id, body) {
        const data = {
            index: index,
            type: type,
            id: id,
            body: body
        };

        return data;
    }

    async indexDataArr(indexDataArr) {

        try {
            const results = [];
            for (let indexData of indexDataArr) {
                results.push(this.indexData(indexData));
            }
            await Promise.all(results);
        } catch (err) {
            Log.child({
                message: err.message,
                stack: err.stack
            }).error('Error running indexDataArr . See Log.child.errorMessage.');

        }

    }

    async indexData(indexData) {

        try {
            if (Object.entries(indexData).length === 0) {
                return null;
            } else {
                const result = await client.index(indexData);
                return result;
            }
        } catch (err) {
            Log.child({
                message: err.message,
                stack: err.stack
            }).error(`Error running indexData for  ${indexData.index} and ${indexData.id} . See Log.child.errorMessage. ${err}`);
            return {};
        }

    }

    async deleteIndex(index) {
        try {
            const result = await client.indices.delete({
                index
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
    async refreshIndex(index) {
        const result = await client.reindex(index);
        return result;
    }

    async bulkIndex(bulkindexData) {
        try {
            const bulkResponse = await client.bulk({
                refresh: false,
                body: bulkindexData
            });
            // console.log(JSON.stringify(bulkResponse, undefined, 2));
            if (bulkResponse.errors) {
                const erroredDocuments = [];
                bulkResponse.items.forEach((action, i) => {
                    const operation = Object.keys(action)[0];
                    if (action[operation].error) {
                        erroredDocuments.push({
                            status: action[operation].status,
                            error: action[operation].error,
                            operation: bulkindexData[i * 2]
                        });
                    }
                });
                Log.child({
                    erroredDocuments: erroredDocuments
                }).error('AtClass: bulkIndex erroredDocuments');
                return erroredDocuments;
            }
            return true;
        } catch (error) {
            Log.child({
                message: error.message,
                stack: error.stack
            }).error('AtClass: Error in bulkIndex');
            return error;
        }
    }

    async search(index, body) {
        try {
            const data = await client.search({
                index,
                body
            });
            return data;
        } catch (error) {
            Log.child({
                message: error.message,
                stack: error.stack
            }).error('AtClass: Error in ES search');
            return error;
        }
    }

    async searchAndFilterHits(index, body) {
        try {
            const data = await client.search({
                index,
                body
            });
            return data.hits.hits.map(x => x._source);
        } catch (error) {
            Log.child({
                message: error.message,
                stack: error.stack
            }).error('AtClass: Error in ES search');
            return error;
        }
    }

    async getSchema(index) {
        try {
            return await new Promise((resolve, reject) => {
                client.indices.getMapping({
                    index
                }, (error, data) => {
                    resolve(data);
                });
            });
        } catch (error) {
            return error;
        }
    }

    async updateByQuery(index, type, body) {
        try {
            return await client.updateByQuery({
                index: index,
                type: type,
                body: body
            });
        } catch (error) {
            return error;
        }
    }

    /**
     * Constructs all the given parameters needed to make a request to Elastic Search. 
     * @param {*} payload 
     */
}
const esService = new ESService();
export {
    esService
};