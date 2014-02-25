/**
 * vim: set sw=2:
 * Module dependencies.
 */
var logger = require('./logger')
  , tty = require('tty');

var exports = module.exports = logger();

exports.logger = logger;

exports.useColors = tty.isatty();

var origin = {};
var methods = ['log','info','warn','error','dir','trace'];

/**
 * replace origin console methods.
 *
 * @api public
 */
function replace() {
  methods.forEach(function(m){
      origin[m] = console[m];
      console[m] = exports[m];
  })
}

/**
 * restore origin console methods
 */
function restore() {
  methods.forEach(function(m){
      origin[m] = console[m];
      console[m] = exports[m];
  })
}

exports.replace = exports.replaceConsole = replace;
exports.restore = exports.restoreConsole = restore;
