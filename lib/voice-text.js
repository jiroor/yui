'use strict';

var fs = require('fs');

var async = require('neo-async');
var Speaker = require('speaker');
var VoiceText = require('voicetext');
var wav = require('wav');
var _ = require('lodash');

var config = require('../config');

var voiceText, speaker, reader;

init();

/**
 * entry point
 */
function init() {
  voiceText = new VoiceText(config.voiceText.apiKey);
  // TODO: changeable from outside
  speaker = voiceText.speaker(voiceText.SPEAKER.SHOW);
}

function speak(sentence, cb) {
  sentence = sentence || config.voiceText.message.default;
  async.angelfall([
    speaker.speak.bind(speaker, sentence),
    saveWav,
    readyWav,
    playWav
  ], cb || _.noop);
}

function saveWav(buf, next) {
  fs.writeFile(config.wav.path.play, buf, 'binary', next);
}

function readyWav(next) {
  var file = fs.createReadStream(config.wav.path.play);
  reader = new wav.Reader();
  reader.on('format', next.bind(null, null));
  file.pipe(reader);
}

function playWav(format, next) {
  reader.pipe(new Speaker(format));
  next();
}

module.exports = {
  speak: speak
};
