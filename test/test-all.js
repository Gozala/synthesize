/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true browser: true devel: true
         forin: true latedef: false globalstrict: true*/

"use strict";

var compound = require("../compound")

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
  var t1 = (compound)
    (method("toUpperCase"))
    (method("replace"), "A", "X")

  assert.equal(t1("a b c d"), "X B C D", "compound function works")
}


exports["test compound functions are compoundable"] = function(assert) {
  var t1 = (compound)
    (method("toUpperCase"))
    (method("replace"), "A", "X")

  assert.equal(t1("a b c d"), "X B C D", "compound function works")

  var t2 = (compound)
    (t1)
    (method("split"), " ")
    (attribute, 0)

  assert.equal(t2("a b c d"), "X", "compound function can be further compound")
  assert.equal(t1("a b"), "X B", "first compound function is not changed")
}

exports["test data bound compound fn"] = function(assert) {
  var t1 = (compound)
    ("a b c d")
    (method("toUpperCase"))
    (method("replace"), "A", "X")

  assert.equal(t1(), "X B C D", "data can be bound")
}


require("test").run(exports)
