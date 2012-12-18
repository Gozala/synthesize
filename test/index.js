/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true browser: true devel: true
         forin: true latedef: false globalstrict: true*/

"use strict";

var synthesize = require("../core")

var slicer = Array.prototype.slice

function method(name) {
  return function methodCall(target) {
    return target[name].apply(target, slicer.call(arguments, 1))
  }
}

function attribute(object, name) {
  return object[name]
}

exports["test basic"] = function(assert) {
  var t1 = (synthesize)
    (method("toUpperCase"))
    (method("replace"), "A", "X")

  assert.equal(t1("a b c d"), "X B C D", "synthesize function works")
}


exports["test synthesize functions are compositeable"] = function(assert) {
  var t1 = (synthesize)
    (method("toUpperCase"))
    (method("replace"), "A", "X")

  assert.equal(t1("a b c d"), "X B C D", "synthesize function works")

  var t2 = (synthesize)
    (t1)
    (method("split"), " ")
    (attribute, 0)

  assert.equal(t2("a b c d"), "X", "synthesize function can be further synthesize")
  assert.equal(t1("a b"), "X B", "first synthesize function is not changed")
}

exports["test data bound synthesize fn"] = function(assert) {
  var t1 = (synthesize)
    ("a b c d")
    (method("toUpperCase"))
    (method("replace"), "A", "X")

  assert.equal(t1(), "X B C D", "data can be bound")
}


require("test").run(exports)
