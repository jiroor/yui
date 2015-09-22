'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var filepath = path.resolve(__dirname, '../json/message.json');

var message = require(filepath);

function save(arg) {
  message.push(arg);
  message = _.uniq(message);
  fs.writeFileSync(filepath, JSON.stringify(message, null, '  '));
}

module.exports = {
  save: save
};
