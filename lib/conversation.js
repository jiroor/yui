'use strict';

var path = require('path');
var _ = require('lodash');

var filepath = path.resolve(__dirname, '../json/conversation.json');

var conversation = require(filepath);

function compile(julius, cb) {
  var pausedSentence = _.find(conversation, 'role', 'pause').in;
  julius.setPausedSentence(pausedSentence);

  var resumedSentence = _.find(conversation, 'role', 'resume').in;
  julius.setResumedSentence(resumedSentence);

  conversation.forEach(function(data, index) {
    data.inReg = new RegExp(data.in);

    julius.addGrammar(data.in, (index === conversation.length - 1) && cb);
  });
}

function converse(str) {
  var found = _.find(conversation, function(data) {
    return data.inReg.test(str);
  });

  return found || {
    in: str,
    out: str
  };
}

module.exports = {
  compile: compile,
  converse: converse
};
