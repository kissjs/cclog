var cclog = require('./cclog');
var fs = require('fs')
cclog.inspect('33', 33, "33", [33]);

cclog.replace();

console.log('replace with cclog');
console.log('this is log');
console.log({object: 'this is object'});
console.info('this is info');
console.warn('this is warn');
console.error('this is error');
console.log('console.trace')
console.trace({msg: 'this is an object'});
console.trace(new Error('this is an error'));
console.dir({obj: 'dir obj'})

// this will error
fs.mkdir(__dirname + '/test.js', console.ifError);

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
