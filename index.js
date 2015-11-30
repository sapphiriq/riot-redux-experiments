var jade = require('jade');

function compileTemplate(module, filename) {
  var template = jade.compileFile(filename, {inlineRuntimeFunctions: false})();
  var body = 'module.exports = ' + JSON.stringify(template) + ';';
  module._compile(body, filename);
}

if (require.extensions) {
  require.extensions['.jade'] = compileTemplate;
};

require('babel/register');
require('./src/server/server')();
