# cclog

Colorful console log, with line number via v8 [callSite](http://github.com/visionmedia/callsite).


## Installation

    npm install cclog
    
## Usage

### cclog.useColors
if `true` show colors in log, default `tty.isatty()`
### cclog.setLevel(levelStr)
only show log with the setting level or above.
avariable params: `debug`, `info`, `warn`, `error`, `none`
### cclog.logger(filename|options)
return a new logger object.
`cclog` is also a logger object;
options.filename
options.stdout
options.stderr

### cclog(fmt, [...])
### cclog.log(fmt, [...])
### cclog.info(fmt, [...])
*stdout* fmt see [util.format](http://nodejs.org/api/util.html#util_util_format_format)

### cclog.warn(fmt, [...])
### cclog.error(fmt, [...])
*stderr* fmt see [util.format](http://nodejs.org/api/util.html#util_util_format_format)


### cclog.dir(obj, level)
*stdout* inspect obj

### cclog.trace(obj)
*stderr* if obj is `Error` instance then log the stack, else inspect it.

### cclog.ifError
*stderr* generate a function to handle error.

```js
fs.mkdir('/foo', function(err) {
  if(err) cclog.trace(err);
});
```

use `cclog.ifError` to get a closure, NOTE always use `cclog.`

```js
fs.mkdir('/foo', cclog.ifError);
```

WRONG
```js
var ifError = cclog.ifError;
fs.mkdir('/foo', ifError);
```
### cclog.intercept(callback)

```
db.get('foo', cclog.intercept(handle));
```

alias

```
db.get('foo', function(err, data) {
  cclog.info(err, data);
  handle(err, data);
}
```

### cclog.replace()
replace `console` functions with `cclog`, `console.log(msg)` will work like `cclog.log(msg)`

### cclog.restore()
restore original `console` functions, but keep the function that doesn't present in original `console`.

## Snapshot

![](http://club.cnodejs.org/user_data/images/4efc278525fa69ac6900003e/4efc278525fa69ac6900003e1333196595688.png)

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
