'use strict';

var Julius = require('julius');
var _ = require('lodash');

var config = require('../config');

var julius, grammar, tasks, compiled;
var paused, sentence;

init();

/**
 * entry point
 */
function init() {
  // inittialize and register grammar
  grammar = new Julius.Grammar();

  // initialize julius
  tasks = [];

  paused = true;
  sentence = {};
}

/**
 * register action that recognize by julius
 */
function whenRecognized(recognized) {
  checkAndRun(function() {
    julius.on('result', function(res) {
      if (sentence.resume.test(res)) {
        paused = false;
      }

      if (!paused) {
        recognized(res);
      }

      if (sentence.pause.test(res)) {
        paused = true;
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

/**
 * set sentence to pause julius
 */
function setPausedSentence(arg) {
  sentence.pause = new RegExp(arg);
}

/**
 * set sentence to resume julius
 */
function setResumedSentence(arg) {
  sentence.resume = new RegExp(arg);
}

function compile(cb) {
  grammar.compile(function() {
    compiled = true;

    julius = new Julius(grammar.getJconf());

    while (tasks.length) {
      tasks.shift()();
    }

    _.isFunction(cb) && cb();
  });
}

function addGrammar(str, cb) {
  compiled = false;

  grammar.add(str);
  cb && compile(cb);
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
  pause: pause,
  resume: resume,
  setPausedSentence: setPausedSentence,
  setResumedSentence: setResumedSentence,
  compile: compile,
  addGrammar: addGrammar
};
