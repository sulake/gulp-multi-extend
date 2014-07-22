'use strict';

var extend = require('../');
var fs = require('fs');
var File = require('gulp-util').File;
var path = require('path');
require('should');
require('mocha');

describe('gulp-multi-extend', function () {
  var srcFile;

  beforeEach(function () {
    srcFile = new File({
      path: 'test/fixtures/en.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/en.json')
    });
  });

  it('should extend file contents', function (done) {
    var stream = extend('test/fixtures/base.json');

    stream.on('data', function (file) {
      var filePath = path.resolve(file.path);
      var expectedFilePath = path.resolve('test/fixtures/en.json');
      var fileContents = String(file.contents);
      var expectedFileContents = '{"base":"Base","test":"Test"}';

      filePath.should.equal(expectedFilePath);
      fileContents.should.equal(expectedFileContents);
      done();
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should use process function on extend file contents', function (done) {
    var stream = extend('test/fixtures/all.json', function (filePath, contents) {
      var basename = path.basename(filePath, path.extname(filePath));
      return contents[basename];
    });

    stream.on('data', function (file) {
      var fileContents = String(file.contents);
      var expectedFileContents = '{"all":"All","test":"Test"}';

      fileContents.should.equal(expectedFileContents);
      done();
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should use jsonSpace', function (done) {
    var stream = extend('test/fixtures/base.json', null, 2);

    stream.on('data', function (file) {
      var fileContents = String(file.contents);
      var expectedFileContents = '{\n  "base": "Base",\n  "test": "Test"\n}';

      fileContents.should.equal(expectedFileContents);
      done();
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should error without fileName', function () {
    extend.should.throw('gulp-multi-extend: Missing filePath parameter');
  });

  /* jshint -W068 */
  it('should error on invalid extend file', function () {
    (function () {
      extend('test/fixtures/invalid.json');
    }).should.throw('gulp-multi-extend: File "test/fixtures/invalid.json" has errors (SyntaxError: Unexpected token i)');
  });
  /* jshint +W068 */

  it('should error on invalid processFn', function (done) {
    var stream = extend('test/fixtures/base.json', 'notFunction');

    stream.on('error', function (error) {
      error.message.should.equal('gulp-multi-extend: TypeError: string is not a function');
      done();
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should error on invalid source file', function (done) {
    var invalidFile = new File({
      path: 'test/fixtures/invalid.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/invalid.json')
    });

    var stream = extend('test/fixtures/base.json');

    stream.on('error', function (error) {
      error.message.should.equal('gulp-multi-extend: File "test/fixtures/invalid.json" has errors (SyntaxError: Unexpected token i)');
      done();
    });

    stream.write(invalidFile);
    stream.end();
  });
});
