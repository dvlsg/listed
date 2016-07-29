"use strict";

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
}

module.exports = {
  List,
  default: List
};
