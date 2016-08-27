"use strict";

function canFlatten(val) {
  return Array.isArray(val); // do we want to support flattening anything other than Arrays? Symbol.iterator?
}

function flatten(input, depth, output) {
  let index = -1;
  const length = input.length >>> 0;
  while (++index < length) {
    const val = input[index];
    if (depth > 0 && canFlatten(val)) {
      if (depth > 1) {
        flatten(val, depth - 1, output);
      }
      else {
        const valLength = val.length >>> 0;
        let valIndex = -1;
        while (++valIndex < valLength) {
          const innerVal = val[valIndex];
          output[output.length] = innerVal;
        }
      }
    }
    else {
      output[output.length] = val; // we've hit the last depth or the val cant be flattened, push as is.
    }
  }
  return output;
}

module.exports = flatten;
