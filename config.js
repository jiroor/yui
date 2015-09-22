var requireDir = require('require-dir');
var _ = require('lodash');
var config = requireDir('./config');

Object.keys(config).forEach(function(key) {
  var keyCamelCase = _.camelCase(key);
  if (key !== keyCamelCase) {
    config[keyCamelCase] = config[key];
    delete config[key];
  }
});

config = _.merge(config.index, config);
delete config.index;

module.exports = config;
