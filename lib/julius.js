'use strict';

var Julius = require('julius');
var _ = require('lodash');

var config = require('../config');

var julius, grammar, tasks, compiled;
var paused, sentence;

init();

// # USAGE
//
// 1. `addGrammar`で、認識したい文法の追加
// 2. `compile`で、追加した文法のコンパイル
// 3. `start`で、認識開始
//
// other.
// * `whenRecognized`で、認識した際の動作の設定
// * `pause`, `resume`で、認識の一時停止・再開
// * `setPausedSentence`, `setResumedSentence`で、音声での一時停止・再開の文言の登録

/**
 * エントリーポイント
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
 * 認識できる文法の追加
 * @param {string} str 追加する認識できる文法
 * @param {boolean|function?} cb 追加後、即時コンパイルを行うかどうか。コンパイルのみ行う場合は`true`を、
 *     コンパイルをしてそのコールバックを受け取りたい場合は、コールバック関数を指定する
 */
function addGrammar(str, cb) {
  compiled = false;

  grammar.add(str);
  cb && compile(cb);
}

/**
 * 現在追加されている文法のコンパイル
 * @param {function?} cb コンパイル後のコールバック関数
 */
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

/**
 * juliusに認識されたときに呼ばれる関数の登録
 * @param {function} recognized 認識されたときに呼ばれる関数
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
  addGrammar: addGrammar,
  compile: compile,
  whenRecognized: whenRecognized,
  setPausedSentence: setPausedSentence,
  setResumedSentence: setResumedSentence,
  start: start,
  pause: pause,
  resume: resume
};
