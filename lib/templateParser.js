var handlebars = require('handlebars');
var glob = require('glob');
var fs = require('fs');
var path = require('path');

var contentTree = {
  global: {},
  pages: {}
}

module.exports = function(paths, out) {
  glob(paths, function(er, files) {
    for (var i in files) {
      var fileName = path.basename(files[i], '.html');
      var file = fs.readFileSync(files[i], 'utf-8');
      var ast = handlebars.parse(file).body;

      contentTree.pages[fileName] = {};

      for (var i in ast) {
        var item = ast[i];
        if (item.type !== 'MustacheStatement') continue;

        var fieldName = item.path.parts;
        var params = (function() {
          var arr = [];
          for (var i in item.params) {
            arr.push(item.params[i].original);
          }
          return arr;
        })();

        if (fieldName.indexOf('global') > -1) {
          contentTree.global[fieldName[1]] = params;
        }
        else if (fieldName.indexOf('page') > -1) {
          contentTree.pages[fileName][fieldName[1]] = params;
        }
        else {
          console.error('Field names must start with "global" or "page".');
        }
      }
    }
    fs.writeFileSync(out, JSON.stringify(contentTree, null, '  '));
  });
}