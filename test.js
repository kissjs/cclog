var cclog = require('./cclog');
cclog.useColors = true;
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
fs.mkdir(__dirname + '/test.js', cclog.ifError);

// test ifError for EventEmitter
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();

emitter.on('error', cclog.ifError);

var err = new Error('error from emitter');

emitter.emit('error', err);

// simple callback new Error
function foo(callback) {
  var err = new Error('error from somewhere');
  callback(err);
}

foo(cclog.ifError);

// intercept
function bar(callback) {
    callback(null, 1, 2, 3);
}

bar(cclog.intercept('The bar result'));
foo(cclog.intercept('The bar result', function(err, data) {
            cclog('done', err, data);
}));

cclog.restore();
console.log('');
console.log('restore to origin console');
console.log('this is log');
console.info('this is info');
console.warn('this is warn');
console.error('this is error');

cclog('cclog');
cclog.log('cclog.log');
cclog.info('cclog.info');
cclog.error('cclog.error', new Error('A fake error occused'));
cclog.warn('cclog.warn');

cclog.useColors = false;

cclog('cclog');
cclog.log('cclog.log');
cclog.info('cclog.info');
cclog.error('cclog.error', 'just', {err: 1});
cclog.error('cclog.error', new Error('A fake error occused'));
cclog.warn('cclog.warn');

cclog.setLevel('warn');
cclog.log('should not see this');
cclog.debug('should not see this');
cclog.info('should not see this');
cclog.warn('should see this');
cclog.error('should see this');

var logger = cclog.logger(__dirname + '/log.txt');
logger.log('logger.log');
logger.info('logger.info', 0, 'foo', null, 'bar', undefined);
logger.error('logger.error', new Error('A fake error'), null, 'foo', undefined);

cclog.setLevel('info');
cclog('====== ALL DONE ======');
