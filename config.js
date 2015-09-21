var requireDir = require('require-dir');
var dir = requireDir('./config');

Object.keys(dir).forEach(function(key) {
  var keyCamelCase = key.replace(/(_|\-)(.)/g, function(match, p1, p2) {
    return p2.toUpperCase();
  });
  if (key !== keyCamelCase) {
    dir[keyCamelCase] = dir[key];
    delete dir[key];
  }
});

module.exports = dir;
