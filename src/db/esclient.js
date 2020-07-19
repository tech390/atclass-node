import {
    connection
} from './esconfig';
import elasticsearch from 'elasticsearch';


const client = new elasticsearch.Client(connection);
export { client };