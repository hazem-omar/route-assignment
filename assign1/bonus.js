/**
 * @param {integer} init
 * @return { increment: Function, decrement: Function, reset: Function }
 */
var createCounter = function (init) {
  let obj = {};
  let count = init;
  obj.increment = function () {
    return (count += 1);
  };
  obj.decrement = function () {
    return (count -= 1);
  };
  obj.reset = function () {
    return (count = init);
  };

  return obj;
};

/**
 * const counter = createCounter(5)
 * counter.increment(); // 6
 * counter.reset(); // 5
 * counter.decrement(); // 4
 */
