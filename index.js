'use strict';

var extend = require('node.extend');
var fs = require('fs');
var gutil = require('gulp-util');
var through = require('through2');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-multi-extend';

module.exports = function (fileName, processFn, jsonSpace) {
  var extendContents;

  if (!fileName) {
    throw new PluginError(PLUGIN_NAME, PLUGIN_NAME + ': Missing fileName parameter');
  }

  try {
    extendContents = JSON.parse(fs.readFileSync(fileName, { encoding: 'utf8' }));
  } catch (err) {
    throw new PluginError(PLUGIN_NAME, PLUGIN_NAME + ': File "' + fileName + '" has errors (' + err + ')');
  }

  return through.obj(function (file, enc, callback) {
    var contents;
    var processedContents;

    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, PLUGIN_NAME + ': Streaming not supported'));
      return callback();
    }

    try {
      contents = JSON.parse(file.contents.toString('utf8'));
    } catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, PLUGIN_NAME + ': File "' + file.path + '" has errors (' + err + ')'));
      return callback();
    }

    try {
      processedContents = processFn ? processFn(file.path, extend(true, {}, extendContents)) : extendContents;
      file.contents = new Buffer(JSON.stringify(extend(true, processedContents, contents), null, jsonSpace));
    } catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, PLUGIN_NAME + ': ' + err));
      return callback();
    }

    this.push(file);
    callback();
  });
};
