'use strict';

var irkit = require('node-irkit');
var _ = require('lodash');

var config = require('../config');
var util = require('./util');

var instance;

init();

/**
 * エントリーポイント
 */
function init() {
  instance = irkit.getIRKitInstance({
    localip: config.irkit.ip
  });
}

/**
 * 赤外線信号のやり取りを行う
 * @param {object?} message 送信する赤外線信号
 * @param {function?} cb やり取りを行った後に呼び出されるコールバック関数
 */
function messages() {
  if (!_.isFunction(arguments[0])) {
    instance.postMessages.apply(instance, arguments);
  } else {
    instance.getMessages.apply(instance, arguments);
  }
}

/**
 * 学習を行う。定期的に赤外線信号の有無を確認して、受信した瞬間の信号を返す
 * @param {function} cb 受信した信号を引数に取るコールバック関数
 */
function learn(cb) {
  var interval = setInterval(function() {
    messages(function(err, res) {
      util.log('学習中');
      if (res) {
        clearInterval(interval);
        cb(res);
      }
    });
  }, 1000);
}

module.exports = {
  messages: messages,
  learn: learn
};
