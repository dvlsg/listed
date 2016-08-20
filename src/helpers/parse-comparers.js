"use strict";

const { type, types } = require('./types');

function parseComparers(...args) {
  let comparer = (x, y) => x > y ? 1 : x < y ? -1 : 0; // how to override this? hm.
  let sortDefinitions = [];

  const argLength = args.length;
  let argIndex = -1;
  while (++argIndex < argLength) {
    const arg = args[argIndex];
    const argType = type(arg);
    if (argType === types.array) {
      const [ getter, direction = 1 ] = arg;
      const selector = type(getter) === types.string
        ? x => x[getter]
        : getter;
      sortDefinitions.push({ selector, direction });
    }
    else if (argType === types.string) {
      const hasNegation = arg[0] === '-';
      const direction = hasNegation ? -1 : 1;
      const key = hasNegation ? arg.slice(1) : arg;
      const selector = x => x[key];
      sortDefinitions.push({ selector, direction });
    }
    else if (argType === types.function) {
      const direction = 1;
      const selector = arg;
      sortDefinitions.push({ selector, direction });
    }
  }
  let compositeComparer = (x, y) => {
    const definitionLength = sortDefinitions.length;
    let index = -1;

    while (++index < definitionLength) {
      const definition = sortDefinitions[index];
      const { selector } = definition;
      const selectedX = selector(x.value);
      const selectedY = selector(y.value);
      const compared = comparer(selectedX, selectedY);
      if (compared) { // !== 0
        if (index >= definitionLength) {
          return compared;
        }
        const { direction } = definition;
        return compared * direction;
      }
    }
    return x.index - y.index; // maintain stability
  };
  return compositeComparer;
}

module.exports = parseComparers;
