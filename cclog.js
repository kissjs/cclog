
/**
 * Module dependencies.
 */

var stack = require('callsite')
  , tty = require('tty')
  , util = require('util')
  , pathSep = require('path').sep
  , origin = {}
  ;

origin.log = console.log
origin.info = console.info
origin.warn = console.warn
origin.error = console.error
origin.dir = console.dir

var LEVEL_DEBUG = 1;
var LEVEL_INFO = 2;
var LEVEL_WARN = 3;
var LEVEL_ERROR = 4;

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

var exports = module.exports = function() {
  if(exports.level > 2) return;
  var info = traceFormat(stack()[1], styles.green, 'INFO');
  process.stdout.write(info + util.format.apply(this, arguments) + '\n');
}

exports.useColors = tty.isatty();
exports.level = 0;
exports.info = exports.log = exports;

exports.setLevel = function(str) {
  exports.level = {
    debug: LEVEL_DEBUG,
    info: LEVEL_INFO,
    warn: LEVEL_WARN,
    error: LEVEL_ERROR,
  }[str];
}

exports.debug = function () {
  if(exports.level > LEVEL_DEBUG) return;
  var info = traceFormat(stack()[1], styles.grey, 'DBUG');
  process.stdout.write(info + util.format.apply(this, arguments) + '\n');
}

exports.inspect = function() {
  if(exports.level > LEVEL_INFO) return;
    var text = Array.prototype.map.call(arguments, function(arg){
            return util.inspect(arg, false, 3, exports.useColors)
    });
    var info = traceFormat(stack()[1], styles.grey, 'INFO');
    process.stdout.write(info + text + '\n');
}

exports.warn = function() {
  if(exports.level > LEVEL_WARN) return;
  var info = traceFormat(stack()[1], styles.yellow, 'WARN');
  process.stderr.write(info + util.format.apply(this, arguments) + '\n');
}

exports.error = function() {
  if(exports.level > LEVEL_ERROR) return;
  var info = traceFormat(stack()[1], styles.red, 'ERRO');
  for(var i=0;i<arguments.length;i++) arguments[i]=arguments[i] && arguments[i].stack || arguments[i];
  process.stderr.write(info + util.format.apply(this, arguments) + '\n');
}

exports.dir = function(obj, level) {
  if(exports.level > LEVEL_INFO) return;
  process.stdout.write(traceFormat(stack()[1], styles.blue, 'INFO') + util.inspect(obj, false, level, exports.useColors) + '\n');
}

exports.trace = function(obj) {
  if(exports.level > LEVEL_DEBUG) return;
  // TODO fix trace behavior
  var info = traceFormat(stack()[1], styles.red, 'DBUG');
  if(obj instanceof Error) {
    process.stderr.write(info + obj.stack + '\n');
  } else {
    process.stderr.write(info + util.inspect(obj, false, null, exports.useColors) + '\n');
    printStack(process.stderr, 2, 10);
  }
}

function printStack(out, start, end) {
  var _stack = stack();
  for(var i = start; i< end; i++) {
    var s = _stack[i];
    out.write('    at ' + (s ? ((s.getFunctionName() || '<anonymouse>') + ' \033[35m' + s.getFileName() + ':' + s.getLineNumber() + '\033[39m') : '<native>') + '\n');
  }
}

function ifErrorGetter() {
  var call = stack()[1];
  return function(err) {
    if(exports.level > LEVEL_ERROR) return;
    var __stack = stack();
    // uncomment to show stack
    // process.stdout.write('\n----cclog-debug--\n')
    // process.stdout.write(__stack.map(function(c){return c && (c.getFileName() + ':' + c.getLineNumber()) || '<native>'}).join('\n'))
    // process.stdout.write('\n')
    if(err) {
      if(__stack.length < 2) {
        var str = traceFormat(call, styles.red, 'ERRO');
      } else {
        var emitCall = __stack[1].getFileName() == 'events.js' ? __stack[2] : __stack[1];
        var str = traceFormat(call, styles.red, 'ERRO') + 'at ' + traceFormat(emitCall, styles.yellow);
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

function formatNumber(num) {
  return (num < 10 ? '0' : '') + num;
}

/**
 * formatting function.
 *
 * @param {CallSite}
 * @param {String} calling method
 * @api public
 */

function traceFormat (call, style, levelStr) {
  var basename = call.getFileName().replace(process.cwd() + pathSep, '')
    , date = new Date()
    , str = util.format('%d-%s-%s %s:%s:%s [%s:%d]: ', date.getFullYear(), formatNumber(date.getMonth() + 1), formatNumber(date.getDate()), formatNumber(date.getHours()), formatNumber(date.getMinutes()), formatNumber(date.getSeconds()), basename, call.getLineNumber())

  if (false === exports.traceColors) {
    return str;
  } else if(exports.traceColors === true || exports.useColors) {
    return style[0] + str + style[1];
  } else {
    return levelStr ? levelStr + " " + str : str;
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
