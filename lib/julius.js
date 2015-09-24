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
  grammar.compile(function() {
    julius = new Julius(grammar.getJconf());
    compiled = true;

    while (tasks.length) {
      tasks.shift()();
    }
  });

  paused = false;
  sentence = {};
}

/**
 * register action that recognize by julius
 */
function whenRecognized(recognized) {
  checkAndRun(function() {
    julius.on('result', function(res) {
      switch (res) {
        case sentence.paused:
          paused = true;
          break;
        case sentence.resumed:
          paused = false;
          break;
        default:
          if (!paused) {
            paused = true;
            recognized(res, function() {
              paused = false;
            });
          }
          break;
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
 * set sentent to pause julius
 */
function setPausedSentence(sentence) {
  sentence.paused = sentence;
}

/**
 * set sentent to resume julius
 */
function setResumedSentence(sentence) {
  sentence.resumed = sentence;
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
  pause: pause,
  resume: resume,
  setPausedSentence: setPausedSentence,
  setResumedSentence: setResumedSentence
};
