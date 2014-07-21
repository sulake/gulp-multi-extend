# gulp-multi-extend

A [gulp](https://github.com/wearefractal/gulp) plugin to extend JSON contents with a separate JSON file. Uses [node.extend](https://npmjs.org/package/node.extend) plugin for extend.

## Usage

```javascript
var gulp = require('gulp');
var extend = require('gulp-multi-extend');
var path = require('path');

// Extend JSON files in ./files/to/extend/ folder
// with contents of ./file/to/extend/with.json
// and output files into ./dist folder
gulp.src('./files/to/extend/*.json')
  .pipe(extend('./file/to/extend/with.json'))
  .pipe(gulp.dest('./dist'));
  
// Process with.json file with processJSON function
function processJSON(filePath, contents) {
  var basename = path.basename(filePath, path.extname(filePath));
  // e.g. /path/to/files/to/extend/en.json -> en
  return contents[basename];
}

gulp.src('./files/to/extend/*.json')
  .pipe(extend('./file/to/extend/with.json', processJSON))
  .pipe(gulp.dest('./dist'));
```

## API

### extend(filePath[, processFn [, jsonSpace]])

#### filePath
Type: `String`

The JSON file to extend other files with

#### processFn
Type: `Function(srcFilePath, contents)`

Default: `undefined`

Params:
  - `srcFilePath` - The file path given from `gulp.src`
  - `contents` - The JSON contents of the file given to extend in `filePath`

#### jsonSpace
Type: `String` or `Number`

Default: `undefined`

Number of spaces used for pretty printing JSON.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
