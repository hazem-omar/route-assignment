/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var findKthPositive = function (arr, k) {
  let current = 1;
  let i = 0;

  while (k > 0) {
    if (i < arr.length && arr[i] === current) {
      i++;
    } else {
      k--;
      if (k === 0) {
        return current;
      }
    }
    current++;
  }
};
