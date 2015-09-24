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

      converse.messages && post(converse.messages);

      break;
  }
}

function learn() {
  async.angelfall([
    function(cb) {
      voiceText.speak(confMessage.learn.start, cb);
    },

    function(cb) {
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

      voiceText.speak(confMessage.learn.end);
    }
  ]);
}

function post(messages) {
  async.eachSeries(messages, function(data, next) {
    setTimeout(function() {
      irkit.messages(message.load(data.id), next);
    }, data.delay);
  });
}
