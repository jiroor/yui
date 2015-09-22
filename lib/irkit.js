'use strict';

var irkit = require('node-irkit');
var _ = require('lodash');

var config = require('../config');
var util = require('./util');

var instance;

init();

function init() {
  instance = irkit.getIRKitInstance({
    localip: config.irkit.ip
  });
}

function messages() {
  if (!_.isFunction(arguments[0])) {
    instance.postMessages.apply(instance, arguments);
  } else {
    instance.getMessages.apply(instance, arguments);
  }
}

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
