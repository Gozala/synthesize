/* vim:set ts=2 sw=2 sts=2 expandtab */
/*jshint asi: true undef: true es5: true node: true browser: true devel: true
         forin: true latedef: false globalstrict: true*/

"use strict";

// Utility function is used internally in order to ignore first argument
// on data bound compound functions.
function second(_, value) { return value }

function compile(tasks) {
  /**
  Function takes set of tasks and compiles them into compound function, that
  executes each task and passes result to the next one as a first argument.
  **/
  return function compute(result) {
    /**
    Computes result by running each task and passing it's result along
    with curried arguments to a next one, until queue of tasks is exhausted.
    accumulated result is returned back.
    **/
    var count = tasks.length
    var index = 0

    // compute result by accumulating result of intermediate state and
    // passing it as first argument to a next task.
    while (index < count) {
      var lambda = tasks[index++]
      var params = tasks[index++]
      params[0] = result
      result = lambda.apply(lambda, params)
    }
    return result
  }
}

function compound(lambda) {
  /**
  Chains operations into compound function by queueing tasks and curring
  provided arguments, until invoked with a non-function first argument. In
  that case queued tasks are compiled to a compound function that can be
  used to perform chained operations. Note that compilation will prevent
  any further chaining, although compound results can be used in a different
  compositions.
  **/

  // This is a placeholder for compiled compound function.
  var composite = void(0)
  // Tasks are queued into `tasks` array. Every odd element is a function
  // followed by even element of curried arguments for it. If first argument
  // is not a function, then we create compound function with bound initial
  // value. Utility function `second` is used so that bound value will be
  // returned regardless of the passed arguments to a compiled function.
  var tasks = typeof(lambda) === "function" ? [lambda, arguments]
                                            : [second, [second, lambda]]

  return function chain(lambda/*, ...params*/) {
    // If composite function has being compiled, execute it.
    if (composite) {
      return composite(lambda)
    }
    // If first argument is a function, then queue it into tasks.
    else if (typeof(lambda) === "function") {
      tasks.push(lambda, arguments)
      return chain
    }
    // If first argument is not a function then compile tasks into function.
    else {
      composite = compile(tasks)
      return composite(lambda)
    }
  }
}

module.exports = compound
