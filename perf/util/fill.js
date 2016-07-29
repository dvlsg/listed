"use strict";

function fill(start = 0, end = 100) {
  let arr = [];
  for (let i = start; i < end; i++) {
    arr[i - start] = i;
  }
  return arr;
}

module.exports = fill;
