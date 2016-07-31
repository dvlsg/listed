"use strict";

const identity = x => x;

class List extends Array {
  get [Symbol.toStringTag]() {
    return 'List';
  }

  static from(arraylike) {
    const length = arraylike.length >>> 0;
    const list = new List(length);
    let index = -1;
    while (++index < length) {
      list[index] = arraylike[index];
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

  filter(predicate = identity) {
    const length = this.length >>> 0;
    const list = new List();
    let index = -1;
    while (++index < length) {
      const val = this[index];
      if (predicate(val, index, this))
        list[list.length] = val;
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
}

module.exports = {
  List,
  default: List
};
