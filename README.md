# cclog

colorful console log

Extends the native Node.JS `console` object to prefix logging functions
with the [CallSite](http://github.com/visionmedia/callsite) information.

To read more about runtime stack trace introspection you can refer to [this
article](http://www.devthought.com/2011/12/22/a-string-is-not-an-error/#beyond).

![](http://club.cnodejs.org/user_data/images/4efc278525fa69ac6900003e/4efc278525fa69ac6900003e1333196595688.png)

## How to use

```js
var cclog = require('cclog');
cclog.log('my information');
cclog.info('my information');
cclog.warn('my information');
cclog.error('my information');
```

* traceError

Sometimes the err is not a `Error` instance but an object, `console.log(err.stack)` will fail, maybe you want 
inspect this object.

```js
cclog.traceError(new Error('error object'));
cclog.traceError({msg: 'error message'});
```

* ifError

Sometimes, we just need log the error.

```js
fs.mkdir(dir, cclog.ifError);
```

You can replace origin console

```js
require('cclog').replace();
console.log('replaced with cclog');
```

and restore to origin console

```JS
require('cclog').replace();
console.log('replaced with cclog');
console.restore();
console.log('restore to origin');
console.replace();
console.log('replaced with cclog again');
```

## License 

(The MIT License)

Copyright (c) 2012 Jason Green &lt;guileen@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
