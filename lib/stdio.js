'use strict';

var readline = require('readline');
var _ = require('lodash');

/**
 * 標準入力を受け付ける
 * @param {string?} msg 入力を受け付ける際に出るメッセージ
 * @param {function} cb 入力した際に呼び出されるコールバック関数
 */
function read(msg, cb) {
  if (!_.isString(msg)) {
    cb = msg;
    msg = '';
  }

  var i = readline.createInterface(process.stdin, process.stdout);
  process.stdout.write(msg);
  i.on('line', cb);
}

module.exports = {
  read: read
};
