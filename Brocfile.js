/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  babel: {
    optional: ['es7.decorators']
  }
});

app.import('vendor/browser-polyfill.js');

module.exports = app.toTree();
