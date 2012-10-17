/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true browser: true devel: true
         forin: true latedef: false globalstrict: true*/

"use strict";

function compute(tasks, result) {
  var count = tasks.length
  var index = 0
  while (index < count) {
    var lambda = tasks[index++]
    var params = tasks[index++]
    params[0] = result
    result = lambda.apply(lambda, params)
  }
  return result
}

function second(_, value) { return value }

function composite(tasks) {
  return function chain(f /*, ...params*/) {
    /**
    Function queues tasks until it's executed with some data instead
    of function argument. In which case it's runs all the queued tasks.
    **/
    return typeof(f) === "function" ? composite(tasks.concat([ f, arguments ])) :
                                      compute(tasks, f)
  }
}

function compound(lambda) {
  return typeof(lambda) === "function" ? composite([ lambda, arguments ]) :
                                         composite([ second, [second, lambda] ])
}

module.exports = compound
