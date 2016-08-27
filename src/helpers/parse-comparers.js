"use strict";

const { type, types } = require('./types');

function makeComparer(sortDefinitions, comparer) {
  return function compare(x, y) {
    const definitionLength = sortDefinitions.length;
    let index = -1;

    while (++index < definitionLength) {
      const definition = sortDefinitions[index];
      const selector = definition.selector; // destructuring seems to be a slight performance hit.
      const selectedX = selector(x.value);
      const selectedY = selector(y.value);
      const compared = comparer(selectedX, selectedY);
      if (compared) { // !== 0
        if (index >= definitionLength) {
          return compared;
        }
        const direction = definition.direction;
        return compared * direction;
      }
    }
    // if the two items are equivalent,
    // return the comparison if the indexes,
    // which will in turn result in a stable sort.
    return x.index - y.index;
  };
}

function parseComparers(comparerDefinitions) {
  const comparer = (x, y) => x > y ? 1 : x < y ? -1 : 0; // how to override this? hm.
  const sortDefinitions = [];
  const argLength = comparerDefinitions.length;
  let argIndex = -1;
  while (++argIndex < argLength) {
    const arg = comparerDefinitions[argIndex];
    const argType = type(arg);
    if (argType === types.array) {
      const [ getter, direction = 1 ] = arg;
      const selector = type(getter) === types.string
        ? x => x[getter]
        : getter;
      sortDefinitions[sortDefinitions.length] = { selector, direction };
    }
    else if (argType === types.string) {
      const hasNegation = arg[0] === '-';
      const direction = hasNegation ? -1 : 1;
      const key = hasNegation ? arg.slice(1) : arg;
      const selector = x => x[key];
      sortDefinitions[sortDefinitions.length] = { selector, direction };
    }
    else if (argType === types.function) {
      const direction = 1;
      const selector = arg;
      sortDefinitions[sortDefinitions.length] = { selector, direction };
    }
  }
  return makeComparer(sortDefinitions, comparer);
}

module.exports = parseComparers;
