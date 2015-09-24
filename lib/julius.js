'use strict';

var Julius = require('julius');
var _ = require('lodash');

var config = require('../config');

var julius, grammar, tasks, compiled, paused;

init();

/**
 * entry point
 */
function init() {
  // inittialize and register grammar
  grammar = new Julius.Grammar();
  addDefaultGrammar();

  // initialize julius
  tasks = [];
  grammar.compile(function() {
    julius = new Julius(grammar.getJconf());
    compiled = true;

    while (tasks.length) {
      tasks.shift()();
    }
  });

  paused = false;
}

/**
 * register action that recognize by julius
 */
function whenRecognized(recognized) {
  checkAndRun(function() {
    julius.on('result', function(res) {
      if (!paused) {
        paused = true;
        recognized(res, function() {
          paused = false;
        });
      }
    });
  });
}

/**
 * start julius
 */
function start() {
  checkAndRun(function() {
    julius.start();
  });
}

/**
 * pause julius
 */
function pause() {
  paused = true;
}

/**
 * resume julius
 */
function resume() {
  paused = false;
}

function addDefaultGrammar() {
  grammar.add('おはようございます');
  grammar.add('こんにちは');
  grammar.add('おやすみなさい');

  _.mapValues(config, function(str) {
    _.isString(str) && grammar.add(str);
  });
}

/**
 * check to compile or not and run task
 */
function checkAndRun(task) {
  if (compiled) {
    task();
    return;
  }

  tasks = tasks || [];
  tasks.push(task);
}

module.exports = {
  whenRecognized: whenRecognized,
  start: start,
  stop: stop
};
