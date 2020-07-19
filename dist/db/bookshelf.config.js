'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _knex = require('./knex');

var _knex2 = _interopRequireDefault(_knex);

var _bookshelf2 = require('bookshelf');

var _bookshelf3 = _interopRequireDefault(_bookshelf2);

var _bookshelfUuid = require('bookshelf-uuid');

var _bookshelfUuid2 = _interopRequireDefault(_bookshelfUuid);

var _bookshelfParanoia = require('bookshelf-paranoia');

var _bookshelfParanoia2 = _interopRequireDefault(_bookshelfParanoia);

var _bookshelfJsonColumns = require('bookshelf-json-columns');

var _bookshelfJsonColumns2 = _interopRequireDefault(_bookshelfJsonColumns);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _bookshelf = (0, _bookshelf3.default)(_knex2.default);
_bookshelf.plugin(_bookshelfUuid2.default);
_bookshelf.plugin('pagination');
_bookshelf.plugin(_bookshelfParanoia2.default, { field: 'deleted_date' });
_bookshelf.plugin(_bookshelfJsonColumns2.default);

exports.default = _bookshelf;
//# sourceMappingURL=bookshelf.config.js.map