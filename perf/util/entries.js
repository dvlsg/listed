"use strict";

function entries(obj) {
  return Object.keys(obj).reduce((arr, key) => {
    arr.push([ key, obj[key] ]);
    return arr;
  }, []);
}

module.exports = entries;
