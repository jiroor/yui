'use strict';

var readline = require('readline');
var _ = require('lodash');

function read(msg, cb) {
  if (!_.isString(msg)) {
    cb = msg;
    msg = '';
  }

  var i = readline.createInterface(process.stdin, process.stdout);
  process.stdout.write(msg);
  i.on('line', cb);
}

module.exports = {
  read: read
};
