require('./cclog').replace();
var fs = require('fs')

console.log('replace with cclog');
console.log('this is log');
console.log({object: 'this is object'});
console.info('this is info');
console.warn('this is warn');
console.error('this is error');
console.log('console.traceError')
console.traceError({msg: 'this is an object'});
console.traceError(new Error('this is an error'));
console.dir({obj: 'dir obj'})

// this will error
fs.mkdir('test.js', console.ifError);
fs.mkdir('test.js', console.logIfError);

// test ifError for EventEmitter
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.on('error', console.ifError);

var err = new Error('error from emitter');

emitter.emit('error', err);

// simple callback new Error
function foo(callback) {
  var err = new Error('error from somewhere');
  callback(err);
}

foo(console.ifError);

console.restore();
console.log('');
console.log('restore to origin console');
console.log('this is log');
console.info('this is info');
console.warn('this is warn');
console.error('this is error');
