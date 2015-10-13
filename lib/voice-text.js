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
 * エントリーポイント
 */
function init() {
  voiceText = new VoiceText(config.voiceText.apiKey);
  // TODO: changeable from outside
  speaker = voiceText.speaker(voiceText.SPEAKER.SHOW);
}

/**
 * 喋る
 * @param {string} sentence 喋る言葉
 * @param {function?} cb 喋り終わった後に呼ばれるコールバック関数
 */
function speak(sentence, cb) {
  sentence = sentence || config.voiceText.message.default;
  async.angelfall([
    speaker.speak.bind(speaker, sentence),
    saveWav,
    readyWav,
    playWav
  ], cb || _.noop);
}

/**
 * wavを保存する
 */
function saveWav(buf, next) {
  fs.writeFile(config.wav.path.play, buf, 'binary', next);
}

/**
 * wavを読み込む
 */
function readyWav(next) {
  var file = fs.createReadStream(config.wav.path.play);
  reader = new wav.Reader();
  reader.on('format', next.bind(null, null));
  file.pipe(reader);
}

/**
 * wavを再生する
 */
function playWav(format, next) {
  reader
    .pipe(new Speaker(format))
    .on('close', next);
}

module.exports = {
  speak: speak
};
