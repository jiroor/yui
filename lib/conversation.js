'use strict';

var path = require('path');
var _ = require('lodash');

var filepath = path.resolve(__dirname, '../json/conversation.json');

var conversation = require(filepath);

function compile(julius) {
  var pausedSentence = _.find(conversation, 'role', 'pause');
  julius.setPausedSentence(pausedSentence);

  var resumedSentence = _.find(conversation, 'role', 'resume');
  julius.setResumedSentence(resumedSentence);

  conversation.forEach(function(data, index) {
    julius.addGrammar(data.in, (index === conversation.length - 1));
  });
}

function converse(str) {
  var found = _.find(conversation, function(data) {
    return new RegExp(data.in).test(str);
  });

  return found || {
    in: str
  };
}

module.exports = {
  compile: compile,
  converse: converse
};
