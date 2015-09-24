'use strict';

var async = require('neo-async');
var _ = require('lodash');

var conversation = require('./lib/conversation');
var irkit = require('./lib/irkit');
var julius = require('./lib/julius');
var stdio = require('./lib/stdio');
var store = require('./lib/store');
var voiceText = require('./lib/voice-text');
var util = require('./lib/util');

var config = require('./config');

var message = config.voiceText.message;

init();

function init() {
  conversation.compile(julius);

  julius.whenRecognized(recognized);
  julius.start();
}

function recognized(res) {
  julius.pause();

  util.log(res);
  switch (res) {
    case config.learn:
      learn();
      break;
    default:
      var converse = conversation.converse(res);
      var sentence = converse.out || res;
      var next = converse.role ? julius[converse.role] : _.noop;
      voiceText.speak(sentence, next);

      break;
  }
}

function learn() {
  async.angelfall([
    function(cb) {
      voiceText.speak(message.learn.start, cb);
    },

    function(cb) {
      irkit.messages(cb.bind(null, null));
    },

    function(cb) {
      irkit.learn(cb.bind(null, null));
    },

    function(res, cb) {
      voiceText.speak(message.learn.name);
      stdio.read('name: ', cb.bind(null, null, res));
    },

    function(res, input, cb) {
      store.save({
        name: input,
        message: res
      });

      voiceText.speak(message.learn.end);
    }
  ]);
}
