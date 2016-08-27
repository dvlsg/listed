"use strict";

const data = require('./util/data');
const run = require('./util/run');
const { assert } = require('chai');

const { List } = require('../');
const { iter } = require('iterablejs');
const Lazy = require('lazy.js');
const lodash = require('lodash');
// no underscore reverse
const ramda = require('ramda');

const listReversed = (input) => () => input.reversed();
const arrayReverse = (input) => () => input.slice().reverse();
const lodashReverse = (input) => () => lodash.reverse(lodash.slice(input));
const ramdaReverse = (input) => () => ramda.reverse(input);
const iterableReverse = (input) => () => input.reverse().toArray();
const lazyReverse = (input) => () => input.reverse().toArray();

const sizes = [
  10,
  100,
  1000
];

const take = (size) => data.slice(0, size);
const list = (size) => List.from(take(size));
const iterable = (size) => iter(take(size));
const lazy = (size) => new Lazy(take(size));

const methods = [
  { name: 'List#reversed()', method: listReversed, provider: list },
  { name: 'Array#reverse()', method: arrayReverse, provider: take },
  { name: 'Lodash.reverse()', method: lodashReverse, provider: take },
  { name: 'Ramda.reverse()', method: ramdaReverse, provider: take },
  { name: 'Iterable#reverse()', method: iterableReverse, provider: iterable },
  { name: 'Lazy#reverse()', method: lazyReverse, provider: lazy }
];

for (let size of sizes) {
  const definitions = {};
  const definitionName = `reversed (${size})`;
  for (let { name, method, provider } of methods) {
    let listExpected = listReversed(list(size))();
    let benchMethod = method(provider(size));
    let otherExpected = List.from(benchMethod());
    assert.deepEqual(listExpected, otherExpected);
    definitions[name] = benchMethod;
  }
  run(definitionName, definitions);
}
