import knex from './knex';
import bookshelf from 'bookshelf';
import bookshelfUuid from 'bookshelf-uuid';
import bookshelfParanoia from 'bookshelf-paranoia';
import jsonColumns from 'bookshelf-json-columns';

const _bookshelf = bookshelf(knex);
_bookshelf.plugin(bookshelfUuid);
_bookshelf.plugin('pagination');
_bookshelf.plugin(bookshelfParanoia, { field: 'deleted_date' });
_bookshelf.plugin(jsonColumns);

export default _bookshelf;
