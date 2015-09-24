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
  addDefaultGrammar();

  // initialize julius
  tasks = [];
  compile();

  paused = true;
  sentence = {};
}

/**
 * register action that recognize by julius
 */
function whenRecognized(recognized) {
  checkAndRun(function() {
    julius.on('result', function(res) {
      if (sentence.resume) {
        paused = false;
      }

      if (!paused) {
        recognized(res);
      }

      if (sentence.pause) {
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
function setPausedSentence(sentence) {
  sentence.pause = sentence
}

/**
 * set sentence to resume julius
 */
function setResumedSentence(sentence) {
  sentence.resume = sentence
}

function compile() {
  grammar.compile(function() {
    compiled = true;

    julius = new Julius(grammar.getJconf());

    while (tasks.length) {
      tasks.shift()();
    }
  });
}

function addGrammar(str, isCompile) {
  compiled = false;

  grammar.add(str);
  isCompile && compile();
}

function addDefaultGrammar() {
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
  pause: pause,
  resume: resume,
  setPausedSentence: setPausedSentence,
  setResumedSentence: setResumedSentence,
  compile: compile,
  addGrammar: addGrammar
};
