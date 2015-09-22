'use strict';

var Julius = require('julius');

var julius, grammar, tasks, compiled;

init();

/**
 * entry point
 */
function init() {
  // inittialize and register grammar
  grammar = new Julius.Grammar();
  grammar.add('おはようございます');
  grammar.add('こんにちは');
  grammar.add('おやすみなさい');

  // initialize julius
  checkAndRun(function() {
    julius = new Julius(grammar.getJconf());
    compiled = true;
  });

  grammar.compile(function() {
    while (tasks.length) {
      tasks.shift()();
    }
  });
}

/**
 * register action that recognize by julius
 */
function whenRecognized(recognized) {
  checkAndRun(function() {
    julius.on('result', recognized);
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
 * stop julius
 */
function stop() {
  checkAndRun(function() {
    julius.stop();
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
