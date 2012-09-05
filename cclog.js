
/**
 * Module dependencies.
 */

var callsite = require('callsite')
  , tty = require('tty')
  , util = require('util')
  , origin = {}
  ;

origin.log = console.log
origin.info = console.info
origin.warn = console.warn
origin.error = console.error
origin.dir = console.dir

var styles = {
  //styles
  'bold'      : ['\033[1m',  '\033[22m'],
  'italic'    : ['\033[3m',  '\033[23m'],
  'underline' : ['\033[4m',  '\033[24m'],
  'inverse'   : ['\033[7m',  '\033[27m'],
  //grayscale
  'white'     : ['\033[37m', '\033[39m'],
  'grey'      : ['\033[90m', '\033[39m'],
  'black'     : ['\033[30m', '\033[39m'],
  //colors
  'blue'      : ['\033[34m', '\033[39m'],
  'cyan'      : ['\033[36m', '\033[39m'],
  'green'     : ['\033[32m', '\033[39m'],
  'magenta'   : ['\033[35m', '\033[39m'],
  'red'       : ['\033[31m', '\033[39m'],
  'yellow'    : ['\033[33m', '\033[39m']
};

exports.useColors = tty.isatty();

exports.debug = exports.log = function() {
  var info = traceFormat(__stack[1], styles.grey);
  process.stdout.write(info + util.format.apply(this, arguments) + '\n');
}

exports.info = function() {
  var info = traceFormat(__stack[1], styles.green);
  process.stdout.write(info + util.format.apply(this, arguments) + '\n');
}

exports.warn = function() {
  var info = traceFormat(__stack[1], styles.yellow);
  process.stderr.write(info + util.format.apply(this, arguments) + '\n');
}

exports.error = function() {
  var info = traceFormat(__stack[1], styles.red);
  process.stderr.write(info + util.format.apply(this, arguments) + '\n');
}

exports.dir = function(obj, level) {
  process.stdout.write(traceFormat(__stack[1], styles.blue) + util.inspect(obj, false, level, exports.useColors) + '\n');
}

exports.trace = function(obj) {
  var info = traceFormat(__stack[1], styles.red);
  if(obj instanceof Error) {
    process.stderr.write(info + obj.stack + '\n');
  } else {
    process.stderr.write(info + util.inspect(obj, false, null, exports.useColors) + '\n');
  }
}

function ifErrorGetter() {
  var call = __stack[1];
  return function(err) {
    // uncomment to show stack
    // process.stdout.write('\n----cclog-debug--\n')
    // process.stdout.write(__stack.map(function(c){return c && (c.getFileName() + ':' + c.getLineNumber()) || '<native>'}).join('\n'))
    // process.stdout.write('\n')
    if(err) {
      if(__stack.length < 2) {
        var str = traceFormat(call, styles.red);
      } else {
        var emitCall = __stack[1].getFileName() == 'events.js' ? __stack[2] : __stack[1];
        var str = traceFormat(call, styles.red) + 'at ' + traceFormat(emitCall, styles.yellow);
      }
      if(err instanceof Error) {
        str += err.stack + '\n';
      } else {
        str += util.inspect(err, false, null, exports.useColors) + '\n';
      }
      process.stderr.write(str);
    }
  }
}

exports.__defineGetter__('ifError', ifErrorGetter);

/**
 * formatting function.
 *
 * @param {CallSite}
 * @param {String} calling method
 * @api public
 */

function traceFormat (call, style) {
  var basename = call.getFileName().replace(process.cwd() + '/', '')
    , date = new Date()
    , str = util.format('%d-%d-%d %d:%d:%d [%s:%d]:', date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), basename, call.getLineNumber())

  if (false === exports.traceColors) {
    return str;
  } else if(exports.traceColors === true || exports.useColors) {
    return style[0] + str + style[1];
  } else {
    return str;
  }
}

/**
 * Adds trace getter to the `console` object.
 *
 * @api public
 */
exports.replace = function() {

  function replace() {
    console.log = exports.log
    console.info = exports.info
    console.warn = exports.warn
    console.error = exports.error
    console.dir = exports.dir
    console.trace = exports.trace
    console.__defineGetter__('ifError', ifErrorGetter);
  }

  function restore() {
    console.log = origin.log
    console.error = origin.error
    console.warn = origin.warn
    console.info = origin.info
    console.dir = origin.dir
  }

  console.replace = exports.replace = replace;
  console.restore = exports.restore = restore;

  replace();
}
