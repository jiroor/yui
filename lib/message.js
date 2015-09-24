'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var filepath = path.resolve(__dirname, '../json/message.json');

var message = require(filepath);

function save(arg) {
  arg.id = message.length;
  message.push(arg);
  fs.writeFileSync(filepath, JSON.stringify(message, null, '  '));
}

function load(id) {
  return _.find(message, 'id', id);
}

module.exports = {
  save: save
};
