# synthesize

[![Build Status](https://secure.travis-ci.org/Gozala/synthesize.png)](http://travis-ci.org/Gozala/synthesize)

This is small function chaining library that allows one to synthesize units
of computation. Unlike very popular method chaining, this feels and behaves
differently!

### Unlimited

One of the main limitations of method chaining is that it's limited to the
predefined set of methods. All the user space functions are second class
that is usually limiting. This library does not has this limitation as
chaining happens on arbitrary functions:

```js
function descriptor(source) {
  return Object.getOwnPropertyNames(source).reduce(function(result, name) {
    result[name] = Object.getOwnPropertyDescriptor(source, name)
    return result
  }, {})
}

function merge() {
  var sources = Array.prototype.slice.call(arguments)
  var target = sources.shift()
  var whitelist = {}
  sources.forEach(function(source) {
    var properties = descriptor(source)
    Object.keys(properties).forEach(function(name) {
      whitelist[name] = properties[name]
    })
  })
  return Object.defineProperties(target, whitelist)
}

function pick() {
  var names = Array.prototype.slice.call(arguments)
  var source = names.shift()
  var properties = descriptor(source)
  var whitelist = {}
  names.forEach(function(name) {
    whitelist[name] = properties[name]
  })
  return Object.create(Object.getPrototypeOf(source), whitelist)
}

var synthesize = require("synthesize")

var hash = (synthesize)
 (merge, { x: 12, y: 13 })
 (pick, 'a', 'b', 'x')
 ({ a: 1, b: 2, c: 3, d: 4 })
```

### Lazy

Another key difference is that intermidiate values are not computed during
chaining, instead chaining creates synthesize functions that can be invoked
to perform all the chained computations.


```js
var t = (synthesize)
  (merge, { x: 12, y: 13 })
  (pick, 'a', 'b', 'x')

typeof(t)                     // => function
t({ a: 1, b: 2, c: 3, d: 4 }) // => { x: 12, a: 1, b: 2 }
```

### composable

Since result of chaining is just an ordinary function, they can be further
synthesizeed, or used in any other kind of functional composition.


```js
function method(name) {
  return function methodCall(target) {
    return target[name].apply(target, Array.prototype.slice.call(arguments, 1))
  }
}

var t1 = (synthesize)
  (method("toUpperCase"))
  (method("replace"), "A", "X")

t1("a b c")     // => "X B C"

var t2 = (synthesize)
  (t1)
  (method("split"), " ")
  (method("join"), "-")

t2("a b c")     // => "X-B-C"
```

## Install

    npm install synthesize
