'use strict';

var async = require('neo-async');

var irkit = require('./lib/irkit');
var julius = require('./lib/julius');
var stdio = require('./lib/stdio');
var store = require('./lib/store');
var voiceText = require('./lib/voice-text');
var util = require('./lib/util');

var config = require('./config');

var message = config.voiceText.message;
var paused;

init();

function init() {
  julius.whenRecognized(recognized);
  julius.start();
}

function recognized(res) {
  util.log(res);
  switch (res) {
    case config.start:
      paused = false;
      voiceText.speak(message.start);
      break;
    case config.stop:
      paused = true;
      voiceText.speak(message.stop);
      break;
    case config.learn:
      learn();
      break;
    default:
      paused || voiceText.speak(res);
      break;
  }
}

function learn() {
  paused = true;

  async.angelfall([
    function(next) {
      voiceText.speak(message.learn.start, next);
    },

    function(next) {
      irkit.messages(next.bind(null, null));
    },

    function(next) {
      irkit.learn(next.bind(null, null));
    },

    function(res, next) {
      voiceText.speak(message.learn.name);
      stdio.read('name: ', next.bind(null, null, res));
    },

    function(res, input, next) {
      store.save({
        name: input,
        message: res
      });

      paused = false;
      voiceText.speak(message.learn.end);
    }
  ]);
}
