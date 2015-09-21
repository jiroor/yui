var fs = require('fs');

var async = require('neo-async');
var Julius = require('julius');
var VoiceText = require('voicetext');
var wav = require('wav');
var Speaker = require('speaker');

var config = require('./config');

var grammar, voiceText, speaker, reader;

async.angelfall([
  setting,
  compile,
  startJulius
]);

function setting(next) {
  grammar = new Julius.Grammar();
  // registry grammar
  grammar.add('おはようございます');
  grammar.add('こんにちは');
  grammar.add('おやすみなさい');

  voiceText = new VoiceText(config.voiceText.apiKey);

  speaker = voiceText.speaker(voiceText.SPEAKER.SHOW);

  next();
}

function compile(next) {
  grammar.compile(next);
}

function startJulius(next) {
  var julius = new Julius(grammar.getJconf());
  julius.on('result', recognized);
  julius.start();
  next();
}

function recognized(res) {
  console.log(res);
  async.angelfall([
    getWav.bind(null, res),
    saveWav,
    readyWav,
    playWav
  ]);
}

function getWav(res, next) {
  speaker.speak(res, next);
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
