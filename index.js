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
  async.angelfall([
    conversation.compile.bind(null, julius),

    function(next) {
      julius.whenRecognized(recognized);
      julius.start();
      next();
    }
  ]);
}

function recognized(res) {
  util.log(res);

  var converse = conversation.converse(res);
  var next = getRoleAction(converse.role) || _.noop;

  voiceText.speak(converse.out, next);
  converse.messages && post(converse.messages);
}

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

function learn() {
  async.angelfall([
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

      voiceText.speak(confMessage.learn.end, cb);
    }
  ]);
}

function post(messages) {
  async.eachSeries(messages, function(data, next) {
    setTimeout(function() {
      irkit.messages(message.load(data.id).message, next);
    }, data.delay || 0);
  });
}
