var gulp = require('gulp');
var parseTemplates = require('./lib/templateParser');

gulp.task('default', function() {

  parseTemplates('test/**/*.html', './output.json');

});