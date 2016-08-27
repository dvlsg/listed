"use strict";

const data = require('./util/data');
const run = require('./util/run');
const { assert } = require('chai');

const { List } = require('../');
const Lazy = require('lazy.js');
const lodash = require('lodash');
const underscore = require('underscore');
const ramda = require('ramda');

const listTail = (input) => () => input.tail();
const arraySlice = (input) => () => input.slice(1);
const underscoreRest = (input) => () => underscore.rest(input);
const lodashTail = (input) => () => lodash.tail(input);
const ramdaTail = (input) => () => ramda.tail(input);
const lazyTail = (input) => () => input.tail().toArray();

const sizes = [
  10,
  100,
  1000
];

const take = (size) => data.slice(0, size);
const list = (size) => List.from(take(size));
const lazy = (size) => new Lazy(take(size));

const methods = [
  { name: 'List#tail()', method: listTail, provider: list },
  { name: 'Array#slice()', method: arraySlice, provider: take },
  { name: 'Lodash.tail()', method: lodashTail, provider: take },
  { name: 'Underscore.rest()', method: underscoreRest, provider: take },
  { name: 'Ramda.tail()', method: ramdaTail, provider: take },
  { name: 'Lazy#tail()', method: lazyTail, provider: lazy }
];

for (let size of sizes) {
  const definitions = {};
  const definitionName = `tail (${size})`;
  for (let { name, method, provider } of methods) {
    let listExpected = listTail(list(size))();
    let benchMethod = method(provider(size));
    let otherExpected = List.from(benchMethod());
    assert.deepEqual(listExpected, otherExpected);
    definitions[name] = benchMethod;
  }
  run(definitionName, definitions);
}
