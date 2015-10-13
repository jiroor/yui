'use strict';

var async = require('neo-async');
var _ = require('lodash');

var conversation = require('./lib/conversation');
var irkit = require('./lib/irkit');
var julius = require('./lib/julius');
var message = require('./lib/message');
var stdio = require('./lib/stdio');
var voiceText = require('./lib/voice-text');
var util = require('./lib/util');

var config = require('./config');

var confMessage = config.voiceText.message;

init();

/**
 * エントリーポイント
 */
function init() {
  async.angelfall([
    conversation.compile.bind(null, julius),

    function(next) {
      julius.whenRecognized(recognized);
      julius.start();
      next();
    }
  ]);
}

/**
 * juliusが音声を認識した際に呼び出される関数
 * @param {string} res 認識した音声の文字列
 */
function recognized(res) {
  util.log(res);

  var converse = conversation.converse(res);
  var next = getRoleAction(converse.role) || _.noop;

  voiceText.speak(converse.out, next);
  converse.messages && post(converse.messages);
}

/**
 * 役割に応じた動作を行う関数を返す
 * @param {string} role pause|resume|learn
 * @return {function}
 */
function getRoleAction(role) {
  switch (role) {
    case 'pause':
      return julius.pause;
    case 'resume':
      return julius.resume;
    case 'learn':
      return learn;
  };
}

/**
 * リモコンの信号を学習する
 */
function learn() {
  async.angelfall([
    function(cb) {
      // 一度取得して信号を削除する
      irkit.messages(cb.bind(null, null));
    },

    function(cb) {
      irkit.learn(cb.bind(null, null));
    },

    function(res, cb) {
      voiceText.speak(confMessage.learn.name);
      stdio.read('name: ', cb.bind(null, null, res));
    },

    function(res, input, cb) {
      message.save({
        name: input,
        message: res
      });

      voiceText.speak(confMessage.learn.end, cb);
    }
  ]);
}

/**
 * IRKitにmessageを飛ばす
 * @param {object[]} messages
 */
function post(messages) {
  async.eachSeries(messages, function(data, next) {
    setTimeout(function() {
      irkit.messages(message.load(data.id).message, next);
    }, data.delay || 0);
  });
}
