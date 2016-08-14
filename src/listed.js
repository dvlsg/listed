"use strict";

const co = require('co');

const identity = x => x;
const arrayConcat = Array.prototype.concat;

class ListPromise extends Promise {
  get [Symbol.toStringTag]() {
    return 'ListPromise';
  }
}

class List extends Array {
  get [Symbol.toStringTag]() {
    return 'List';
  }

  static from(arraylike) {
    if (arraylike && typeof arraylike.length === 'number') {
      const length = arraylike.length >>> 0;
      const list = new List(length);
      let index = -1;
      while (++index < length) {
        list[index] = arraylike[index];
      }
      return list;
    }
    const list = new List();
    for (let elem of arraylike) {
      list[list.length] = elem;
    }
    return list;
  }

  static of() {
    const length = arguments.length >>> 0;
    const list = new List(length);
    let index = -1;
    while (++index < length) {
      list[index] = arguments[index];
    }
    return list;
  }

  concat() {
    // array concat is the fastest of compared operations.
    // even with the List overhead, this still tops benchmarks
    // (other than native array concat)
    // note that proper array subclass concat should be
    // readily available when node 7.0.0 is released.
    return List.from(arrayConcat.apply(this, arguments));
  }

  every(predicate = identity) {
    const length = this.length >>> 0;
    let index = -1;
    while (++index < length) {
      const val = this[index];
      if (!predicate(val, index, this)) {
        return false;
      }
    }
    return true;
  }

  filter(predicate = identity) {
    const length = this.length >>> 0;
    const list = new List();
    let index = -1;
    while (++index < length) {
      const val = this[index];
      if (predicate(val, index, this)) {
        list[list.length] = val;
      }
    }
    return list;
  }

  map(transformer = identity) {
    const length = this.length >>> 0;
    const list = new List(length);
    let index = -1;
    while (++index < length) {
      const val = this[index];
      list[index] = transformer(val, index, this);
    }
    return list;
  }

  mapAsync(transformer = identity) {
    const self = this;
    return ListPromise.resolve(co(function*() {
      const length = self.length >>> 0;
      const list = new List(length);
      let index = -1;
      while (++index < length) {
        const val = self[index];
        list[index] = transformer(val, index, self);
      }
      return yield list.resolve();
    }));
  }

  mapSeries(transformer = identity) {
    const self = this;
    return ListPromise.resolve(co(function*() {
      const length = self.length;
      const list = new List(length);
      let index = -1;
      while (++index < length) {
        const val = self[index];
        const transforming = transformer(val, index, self);
        list[index] = transforming instanceof Promise
          ? yield transforming
          : transforming;
      }
      return list;
    }));
  }

  reduce(reducer, accumulator) {
    const length = this.length >>> 0;
    let index = -1;
    if (accumulator === undefined) {
      accumulator = this[++index];
    }
    while (++index < length) {
      accumulator = reducer(accumulator, this[index], index, this);
    }
    return accumulator;
  }

  resolve() {
    return ListPromise.all(this).then(List.from);
  }
}

// the method in "value" may not be completely optimized,
// since we're using spread operators,
// but this is simpler to maintain during development.
// consider a refactor once we're done.
Object.defineProperties(
  ListPromise.prototype,
  Object
    .getOwnPropertyNames(List.prototype)
    .filter(x => x !== 'constructor')
    .filter(x => typeof List.prototype[x] === 'function')
    .reduce((definitions, key) => {
      const value = function(...args) {
        return this.then(list => list[key](...args));
      };
      definitions[key] = { value };
      return definitions;
    }, {})
);

module.exports = {
  List,
  ListPromise,
  default: List
};
