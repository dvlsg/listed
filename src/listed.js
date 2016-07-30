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
    let index = -1;
    const length = this.length >>> 0;
    const list = new List();
    while (++index < length) {
      const val = this[index];
      if (predicate(val, index))
        list[list.length] = val;
    }
    return list;
  }

  map(transformer = identity) {
    let index = -1;
    const length = this.length >>> 0;
    const list = new List(length);
    while (++index < length) {
      const val = this[index];
      list[index] = transformer(val, index);
    }
    return list;
  }
}

module.exports = {
  List,
  default: List
};
