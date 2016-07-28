"use strict";

class List extends Array {
  get [Symbol.toStringTag]() {
    return 'List';
  }
}

module.exports = {
  List,
  default: List
};
