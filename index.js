'use strict';

var julius = require('./lib/julius');
var voiceText = require('./lib/voice-text');

init();

function init() {
  julius.whenRecognized(recognized);
  julius.start();
}

function recognized(res) {
  console.log(res);
  voiceText.speak(res);
}
