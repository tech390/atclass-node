import fs from 'fs';
import {
    Log
} from '../utils';
import { client } from './esclient';
import path from 'path';
class ESMigrations {

    async run() {
        let currentFileName = null;
        try {
            const esIndices = fs.readdirSync(path.join(__dirname, '/es_migrations/'))
                .filter(file => file !== 'index.js');

            let esIndicesData = {};
            esIndices.forEach(function (filename) {
                currentFileName = filename;
                let content = fs.readFileSync(path.join(__dirname, '/es_migrations/', filename));
                esIndicesData[filename.split('.')[0]] = JSON.parse(content);
            });
            return await this.processMigrations(esIndicesData);
        } catch (err) {
            Log.info(`Error running ES Migrarions for ${currentFileName}. See Log.child.errorMessage `);
            Log.child({
                message: err.message,
                stack: err.stack
            }).info(`Error running ES Migrarions for ${currentFileName}. See Log.child.errorMessage.`);
            return err;
        }
    }

    async processMigrations(esIndicesData) {
        const results = [];
        for (const [key, value] of Object.entries(esIndicesData)) {
            results.push(this.runMigrations(key, value));
        }
        await Promise.all(results);
        return true;
    }

    async runMigrations(esIndexName, esIndiceBody) {
        let indexExists;
        try {
            indexExists = await client.indices.exists({
                index: esIndexName
            });
            if (!indexExists) {
                Log.info('New Index ' + esIndexName);
                return await client.indices.create({
                    index: esIndexName,
                    body: esIndiceBody
                });
            }
        } catch (err) {
            Log.child({
                message: err.message,
                stack: err.stack
            }).info(`Error running ES Migrarions for ${esIndexName} and update  ${indexExists}. See Log.child.errorMessage.`);
            return err;
        }
    }
}

export const esMigrations = new ESMigrations();