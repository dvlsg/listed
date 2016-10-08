"use strict";

const co = require('co');
const parseComparers = require('./helpers/parse-comparers');
const flatten = require('./helpers/flatten');

const identity = x => x;
const arrayConcat = Array.prototype.concat;
const hasOwnProperty = Object.prototype.hasOwnProperty;

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

  any(predicate = identity) {
    const length = this.length >>> 0;
    let index = -1;
    while (++index < length) {
      const val = this[index];
      if (predicate(val, index, this)) {
        return true;
      }
    }
    return false;
  }

  average(selector = identity) {
    const length = this.length >>> 0;
    if (length === 0) {
      // see here: http://math.stackexchange.com/q/909395
      return NaN;
    }
    return this.sum(selector) / length;
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

  first() {
    return this[0];
  }

  flatMap(transformer = identity) {
    const depth = 1;
    const target = new List();
    const mapped = this.map(transformer);
    return flatten(mapped, depth, target);
  }

  flatten(depth = 1) {
    return flatten(this, depth, new List());
  }

  groupBy(keySelector = identity) {
    if (typeof keySelector === 'string') {
      const keyStr = keySelector;
      keySelector = x => x[keyStr];
    }

    const length = this.length >>> 0;
    let index = -1;
    // this is faster than using an actual map,
    // but we get collisions on 1 and '1'
    // is this an acceptable tradeoff?
    // libraries like lodash also have this collision.
    const obj = Object.create(null);
    const grouped = new List();
    while (++index < length) {
      const val = this[index];
      const key = keySelector(val);
      if (hasOwnProperty.call(obj, key)) {
        obj[key][obj[key].length] = val;
      }
      else {
        const group = GroupedList.of(val); // eslint-disable-line no-use-before-define
        group.key = key;
        obj[key] = group;
        grouped[grouped.length] = group;
      }
    }
    return grouped;
  }

  last() {
    const length = this.length >>> 0;
    return this[length - 1];
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

  mapLimit(transformer = identity, limit = 1) {
    const self = this;
    return new ListPromise((resolve, reject) => {
      const length = self.length >>> 0;
      const list = new List(length);
      let running = 0;
      let index = -1;
      let completed = 0;

      function finished() {
        running -= 1;
        completed += 1;
        if (completed === length) {
          // at this point, we have a List<Promise>, which needs to be translated through Promise.all
          // list.resolve() is a method which should help with this.
          return resolve(list.resolve());
        }
        return iterate(); // eslint-disable-line no-use-before-define
      }

      function next() {
        index += 1;
        const val = self[index];
        running += 1;
        let transforming = transformer(val, index, self);
        if (!(transforming instanceof Promise)) {
          transforming = Promise.resolve(transforming);
        }

        // make sure to put the original resolution back in the list
        list[index] = transforming;

        // but also attach post-processing methods,
        // including catching and rejecting the original Promise
        transforming
          .then(finished)
          .catch(reject);
      }

      function iterate() {
        while (running < limit && index < length - 1) {
          next(); // eslint-disable-line callback-return
        }
      }

      iterate();
    });
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

  none(predicate) {
    return !this.any(predicate);
  }

  orderBy(...args) {
    const comparer = parseComparers(args);
    const length = this.length;
    const result = new List(length);

    // lift value/index into wrapper,
    // since index will not be provided by native Array#sort()
    let index = length;
    while (index--) {
      result[index] = { value: this[index], index };
    }

    // use native sort (seems performant)
    result.sort(comparer);

    // unwrap the values after the comparisons.
    index = length;
    while (index--) {
      result[index] = result[index].value;
    }

    return result;
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

  reversed() {
    let index = this.length >>> 0;
    const list = new List(index);
    const start = index - 1;
    while (--index >= 0) {
      list[start - index] = this[index];
    }
    return list;
  }

  sum(selector = identity) {
    // note: KEEP THIS COMMENT HERE. we're trying to *avoid*
    // allowing v8 crankshaft to inline this function,
    // which appears to be a performance loss at first attempt
    // -- will need to do some additional testing on multiple machines.
    // more reading here: https://top.fse.guru/nodejs-a-quick-optimization-advice-7353b820c92e

    // we could also do this, but it doesnt seem to perform as well
    // return this.reduce((acc, elem) => {
    //   const selected = selector(elem);
    //   if (typeof selected === 'number' && !isNaN(selected)) {
    //     acc += selected;
    //   }
    //   return acc;
    // }, 0);

    let sum = 0;
    const length = this.length >>> 0;
    let index = -1;
    while (++index < length) {
      const selected = selector(this[index]);
      if (typeof selected === 'number' && !isNaN(selected)) {
        sum += selected;
      }
    }
    return sum;
  }

  tail() {
    const length = this.length >>> 0;
    if (length <= 1) {
      return new List();
    }
    const newLength = length - 1;
    const list = new List(newLength);
    let index = -1;
    while (++index < newLength) {
      list[index] = this[index + 1];
    }
    return list;
  }

  take(count = 1) {
    const length = this.length >>> 0;
    const actualCount = count > length ? length : count;
    if (actualCount < 1) {
      return new List();
    }
    let index = -1;
    const list = new List(actualCount);
    while (++index < actualCount) {
      list[index] = this[index];
    }
    return list;
  }

  takeWhile(predicate = identity) {
    const length = this.length >>> 0;
    const list = new List();
    let index = -1;
    while (
         ++index < length
      && predicate(this[index], index, this)
    ) {
      list[index] = this[index];
    }
    return list;
  }

  unique(hasher = identity) {
    const length = this.length >>> 0;
    const list = new List();
    // note that using Object.create(null) is quite a bit faster than Set,
    // but causes us to have collisions on keys (ie '1' and 1 collide)
    const seen = new Set();
    let index = -1;
    while (++index < length) {
      const val = this[index];
      const selected = hasher(val);
      if (!seen.has(selected)) {
        seen.add(selected);
        list[list.length] = val;
      }
    }
    return list;
  }
}

const aliases = {
  all: 'every',
  some: 'any'
};
Object.keys(aliases).forEach(key => {
  const name = aliases[key];
  const value = List.prototype[name];
  Object.defineProperty(
    List.prototype,
    key,
    { value }
  );
});

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

class GroupedList extends List {
  // expect GroupedList.key to exist.
  // we can define it as part of the ctor if we want,
  // but really this class should just be used internally.
  get [Symbol.toStringTag]() {
    return 'GroupedList';
  }
}

module.exports = {
  GroupedList,
  List,
  ListPromise,
  default: List
};
