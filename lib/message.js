'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var filepath = path.resolve(__dirname, '../json/message.json');

var message = require(filepath);

/**
 * 赤外線信号を保存する
 * @param {object} arg 保存する赤外線信号
 */
function save(arg) {
  arg.id = message.length;
  message.push(arg);
  fs.writeFileSync(filepath, JSON.stringify(message, null, '  '));
}

/**
 * 赤外線信号を取得する
 * @param {number} id 取得する赤外線信号のID
 * @return {object}
 */
function load(id) {
  return _.find(message, {
    id: id
  });
}

module.exports = {
  save: save,
  load: load
};
